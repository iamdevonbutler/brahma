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
      obj[prefix + dirname] = indexFile;
      return;
    }
    if (directoryExists(commandsPath)) {
      let commands = self.loadCommands(commandsPath, parent.concat(dirname));
      if (commands) {
        let keys = Object.keys(commands);
        keys.forEach((key) => {
          obj[key] = commands[key];
        });
      }
    }
  });
  files = getFilesSync(src);
  files.forEach(filename => {
    var commandPath = path.join(src, filename);
    var command = require(commandPath);
    var commandName = command.name || removeJSExt(filename);
    obj[prefix + commandName] = command;
  });

  return Object.keys(obj).length ? obj : null;
};

self.loadMetaCommands = (src, parent = []) => {
  var prefix, dirs, obj = {};
  prefix = parent.length ? parent.join('.') + '.' : '';
  dirs = getDirectoriesSync(src);
  dirs.forEach(dirname => {
    var indexPath, commandsPath;
    indexPath = path.join(src, dirname, 'index.js');
    commandsPath = path.join(src, dirname, 'commands');
    if (fileExists(indexPath)) {
      let indexFile = require(indexPath);
      if (!indexFile.main) {
        obj[prefix + dirname] = indexFile;
      }
      else {
        return;
      }
    }
    if (directoryExists(commandsPath)) {
      let metadata = self.loadMetaCommands(commandsPath, parent.concat(dirname));
      let keys = Object.keys(metadata);
      keys.forEach(key => {
        obj[key] = metadata[key];
      });
    }
  });
  return obj;
}
