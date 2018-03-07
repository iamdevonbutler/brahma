const {getDirectoriesSync, getFilesSync, directoryExists, fileExists, removeJSExt} = require('../utils');
const path = require('path');

const self = module.exports;

// @note command key will use ".name" property over filename, if it exists.
self.loadCommands = (src) => {
  var dirs, files, obj = {};
  dirs = getDirectoriesSync(src);
  dirs.forEach(dirname => {
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

self.loadCommandMetadata = (src) => {
  var dirs, obj = {};
  dirs = getDirectoriesSync(src);
  dirs.forEach(dirname => {
    var indexPath, commandsPath;
    indexPath = path.join(src, dirname, 'index.js');
    commandsPath = path.join(src, dirname, 'commands');
    if (fileExists(indexPath)) {
      obj[dirname] = require(indexPath);
    }
    if (directoryExists(commandsPath)) {
      let metadata = self.loadCommandMetadata(commandsPath);
      let keys = Object.keys(metadata);
      keys.forEach(key => {
        obj[dirname + '.' + key] = metadata[key];
      });
    }
  });
  return obj;
}
