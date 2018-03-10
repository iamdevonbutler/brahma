const {getDirectoriesSync, getFilesSync, directoryExists, fileExists, removeJSExt} = require('../utils');
const path = require('path');

const self = module.exports;

// @note commands have a directory w/ an index.js file that has a main() method OR are
// contained w/i a metacommands "commands" directory as a file that contains a main() method.
// @note metacommands have a directory w/ an index.js file that does NOT have a main() method -
// it has subcommands in a "commands" directory, which DO have a main() method or are nested metacommands.
// @note command key will use "name" property over filename, if it exists.
self.loadCommands = (src) => {
  var dirs, files, obj = {};
  dirs = getDirectoriesSync(src);
  dirs.forEach(dirname => {
    let indexFile = require(path.join(src, dirname, 'index.js'));
    if (indexFile.main) {
      obj[dirname] = indexFile;
      return;
    }
    let commandsPath = path.join(src, dirname, 'commands');
    if (directoryExists(commandsPath)) {
      let commands = self.loadCommands(commandsPath);
      if (commands) {
        let keys = Object.keys(commands);
        keys.forEach((key) => {
          var command = commands[key];
          var commandName = command.name || removeJSExt(key);
          obj[dirname + '.' + commandName] = command;
        });
      }
    }
  });
  files = getFilesSync(src);
  files.forEach(filename => {
    var commandPath = path.join(src, filename);
    var command = require(commandPath);
    var commandName = command.name || removeJSExt(filename);
    obj[commandName] = command;
  });

  return Object.keys(obj).length ? obj : null;
};

self.loadMetaCommands = (src) => {
  var dirs, obj = {};
  dirs = getDirectoriesSync(src);
  dirs.forEach(dirname => {
    var indexPath, commandsPath;
    indexPath = path.join(src, dirname, 'index.js');
    commandsPath = path.join(src, dirname, 'commands');
    if (fileExists(indexPath)) {
      let indexFile = require(indexPath);
      if (!indexFile.main) {
        obj[dirname] = indexFile;
      }
      else {
        return;
      }
    }
    if (directoryExists(commandsPath)) {
      let metadata = self.loadMetaCommands(commandsPath);
      let keys = Object.keys(metadata);
      keys.forEach(key => {
        obj[dirname + '.' + key] = metadata[key];
      });
    }
  });
  return obj;
}
