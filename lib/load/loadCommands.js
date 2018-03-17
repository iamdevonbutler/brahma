const {getDirectoriesSync, getFilesSync, directoryExists, fileExists, removeJSExt} = require('../utils');
const path = require('path');

const self = module.exports;

// @note commands have a directory w/ an index.js file that has a main() method OR are
// contained w/i a metacommands "commands" directory as a file that contains a main() method.
// @note metacommands have a directory w/ an index.js file that does NOT have a main() method -
// it has subcommands in a "commands" directory, which DO have a main() method or are nested metacommands.
// @note command key will use "name" property over filename, if it exists.
self.loadCommands = (src, parent = []) => {
  var prefix, dirs, files, obj = {};
  prefix = parent.length ? parent.join('.') + '.' : '';
  dirs = getDirectoriesSync(src);
  dirs.forEach(dirname => {
    var indexFile, commandsPath, indexFilePath;
    indexFilePath = path.join(src, dirname, 'index.js');
    indexFile = require(indexFilePath);
    commandsPath = path.join(src, dirname, 'commands');
    if (indexFile.main) {
      let name = indexFile.name ? prefix + indexFile.name : prefix + dirname;
      obj[name] = {
        ...indexFile,
        name,
      };
      return;
    }
    if (directoryExists(commandsPath)) {
      let commands = self.loadCommands(
        commandsPath,
        parent.concat(indexFile && indexFile.name ? indexFile.name : dirname)
      );
      if (commands) {
        let keys = Object.keys(commands);
        keys.forEach((key) => {
          var name = commands[key].name ? commands[key].name : key;
          obj[name] = {
            ...commands[key],
            name,
          };
        });
      }
    }
  });
  files = getFilesSync(src);
  files.forEach(filename => {
    var commandPath = path.join(src, filename);
    var command = require(commandPath);
    var commandName = command.name || removeJSExt(filename);
    var name = prefix + commandName;
    obj[name] = {
      ...command,
      name,
    };
  });

  return Object.keys(obj).length ? obj : null;
};

self.loadMetaCommands = (src, parent = []) => {
  var prefix, dirs, obj = {};
  prefix = parent.length ? parent.join('.') + '.' : '';
  dirs = getDirectoriesSync(src);
  dirs.forEach(dirname => {
    var indexPath, commandsPath, indexFile;
    indexPath = path.join(src, dirname, 'index.js');
    commandsPath = path.join(src, dirname, 'commands');
    if (fileExists(indexPath)) {
      indexFile = require(indexPath);
      let name = indexFile.name ? prefix + indexFile.name : prefix + dirname;
      if (!indexFile.main) {
        obj[name] = {
          ...indexFile,
          name,
        };
      }
      else {
        return;
      }
    }
    if (directoryExists(commandsPath)) {
      let metadata = self.loadMetaCommands(
        commandsPath,
        parent.concat(indexFile && indexFile.name ? indexFile.name : dirname)
      );
      let keys = Object.keys(metadata);
      keys.forEach(key => {
        var name = metadata[key].name ? prefix + metadata[key].name : prefix + key;
        obj[name] = {
          ...metadata[key],
          name,
        };
      });
    }
  });
  return obj;
}
