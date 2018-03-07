const {getDirectoriesSync, getFilesSync, directoryExists} = require('../utils');
const path = require('path');

module.exports = loadCommands;

function removeExt(obj) {
  if (obj.slice(-3) === '.js') return obj.slice(0, -3);
  return obj;
};

// @note command key will use ".name" property over filename, if it exists.
// @todo double wrap interface.
function loadCommands(src) {
  var dirs, files, obj = {};

  dirs = getDirectoriesSync(src);
  dirs.forEach(dirname => {
    let commandsPath = path.join(src, dirname, 'commands');
    if (directoryExists(commandsPath)) {
      let commands = loadCommands(commandsPath);
      if (commands) {
        let keys = Object.keys(commands);
        keys.forEach((key) => {
          var command = commands[key];
          var commandName = command.name || removeExt(key);
          obj[dirname + '.' + commandName] = command;
        });
      }
    }
  });

  files = getFilesSync(src);
  files.forEach(filename => {
    var commandPath = path.join(src, filename);
    var command = require(commandPath);
    var commandName = command.name || removeExt(filename);
    obj[commandName] = command;
  });

  return Object.keys(obj).length ? obj : null;
};

function loadCommandMetadata() {

}
