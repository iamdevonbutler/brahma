const {EOL} = require('os');
const objectAssign = require('js-object-assign');
const chalk = require('chalk');
const keypress = require('keypress');
const term = require('terminal-kit').terminal;
const History = require('./history');
const stripAnsi = require('strip-ansi');
const minimist = require('minimist');
const objectInterface = require('js-object-interface');
const {getCommonSubstr} = require('../utils');

// @file this is basically a bunch of hacks needed to fix the kludge-like terminal UI when in rawMode.

// @todos
// if you just type in a command it prints the help for that command, same for all subcommands.
// Infinant number of subcommands. test.
// command plugins and subcommand extensions need a way to hook into help

// commands obj dont have have all the commands (install).
// flat outer command. install. what if u had a flat outer command for remote.scale.
// help text w/ examples and other fields for commands.
// command aliases. function and documentation
// commands.get('remote.env').main.call(null); - should resources interface differ, update.
// commands.get('remote.env').main.call(null); - main.call w/ ctx, cant pass in ctx, using `this` is important to access obj data.
// validate command name fields and file/dirnames to ensure they dont have "." in the name.
// calling commands by alias.
// build help.
// pasting into terminal

const self = module.exports;

self.formatHelpText = (commands, verbose = false) => {
  var keys, str = '';
  keys = Object.keys(commands);
  keys.forEach((key, i) => {
    var isCommand, item, alias;
    isCommand = !!self.commands.get(self.breadcrumbs.join('.') + key);
    item = commands[key];
    alias = item.alias ? ' ' + item.alias : '';
    if (i > 0) str += EOL; // if u do this at bottom, u will have an extra line.
    str += '    ' + (isCommand ? chalk.green(item.name) : item.name) + (isCommand ? chalk.green(alias) : alias);
    str += EOL;
    str += '    -> ' + item.description;
    str += EOL;
    if (verbose && item.examples) {
      let examples = [].concat(item.examples);
      examples.forEach(example => str += '       ' + example + EOL);
    }
    if (verbose && item.notes) {
      let notes = [].concat(item.notes);
      notes.forEach(note => str += '    ** ' + note + EOL);
    }
  });
  return `  Commands:${EOL}${EOL}${str}`;
};

self.getDelimiterLength = () => {
  var length = '$brahma'.length + (self.breadcrumbs.length ? self.breadcrumbs.join(' ').length + 2 : 1);
  return length;
};

self.getDelimiter = () => {
  var delimiter = `$brahma${self.breadcrumbs.length ? ' ' + chalk.dim(self.breadcrumbs.join(' ')) : ''} `;
  return delimiter;
};

self.getLineLength = () => {
  var length = self.getDelimiterLength() + self.buffer.length;
  return length;
};

// @todo probably dont increment cursor.
self.write = (data, incrementCursor = true) => {
  if (incrementCursor) {
    self.cursorXIndex += data.length;
  }
  term(data);
};

self.eol = () => {
  self.write(EOL, false);
};

self.cr = (clearBuffer = true) => {
  var delimiter;
  self.cursorXIndex = self.getDelimiterLength();
  if (clearBuffer) self.buffer = '';
  // need to set xIndex here cuz the delimiter has ansi codes.
  delimiter = self.getDelimiter();
  self.eol();
  self.write(delimiter, false);
  if (!clearBuffer) self.write(self.buffer);
};

self.stripData = (data) => {
  data = stripAnsi(data) + '';
  if (data) {
    let asciiCode = data.charCodeAt(0);
    if (asciiCode < 32 || asciiCode > 126) {
      return null;
    }
  }
  return data || null;
};

// find matching command from CLI input considering breadcrumbs.
self.getCommandKey = (input) => {
  let commandKey = self.commands.find((command, key) => {
    var str = self.breadcrumbs.join('.');
    for (let key1 of input) {
      str += str ? '.' + key1 : key1;
      if (key === str) return true;
    }
  });
  return commandKey || null;
};

self.isNavigateBack = (command) => {
  var navigateBack = command.split('/').every(item => item === '..');
  return navigateBack;
};

self.navigateBack = (command) => {
  self.breadcrumbs.splice(-command.split('/').filter(Boolean).length);
  self.cr();
};

self.getHelpObj = (key) => {
  var helpObj;
  // Build helpObj from subcommands.
  helpObj = self.commands.filter((item, commandName) => {
    return key.split('.').length + 1 === commandName.split('.').length && commandName.startsWith(key);
  });
  // Build helpObj from subcommand metadata (which have subcommands themselves).
  if (!helpObj) {
    helpObj = self.metaCommands.filter((item, metaName) => {
      return key.split('.').length + 1 === metaName.split('.').length && metaName.startsWith(key);
    });
  }
  return helpObj;
};

self.callCommand = (commandKey, input) => {
  self.commands.get(commandKey).main.call(null, {
    input,
    cli: self.simpleCLIInterface(),
    commands: self.commands.clone(true),
    metaCommands: self.metaCommands.clone(true),
    breadcrumbs: [].concat(self.breadcrumbs),
  });
};

// CLI interface to be injected in commands.
// You have the power that you need.
self.simpleCLIInterface = () => {
  return {
    formatHelpText: self.formatHelpText,
    cr: self.cr,
    eol: self.eol,
    write(data) {
      self.eol();
      self.write(data, false);
      self.cr();
    }
  };
};

self.getAutocompleteText = (returnMultiple = false) => {
  var commands, result;
  commands = self.commands.keys().map(key => key.split('.').join(' '));
  result = commands.filter(item => item.startsWith(self.buffer));
  if (returnMultiple) return result && result.length ? result : null;
  if (result.length === 1) {
    result = result[0]
  }
  else if (result.length > 1) {
    result = result.reduce((p, c) => getCommonSubstr(p, c));
  }
  return result && result.length ? result : null;
};

self.runCommand = () => {
  if (!self.buffer) return;

  var input, commandObj, commandKey, isCommand, isMetaCommand;

  input = self.buffer.split(' ').filter(Boolean);
  input = minimist(input);
  commandObj = input._;

  // cd back via: .. | ../[../]
  if (self.isNavigateBack(self.buffer)) {
    self.history.add(self.breadcrumbs, self.buffer);
    self.navigateBack(self.buffer);
    return;
  }

  // Help command can be called from all meta directories.
  if (commandObj[0] === 'help') {
    self.eol();
    self.callCommand('help', input);
    return;
  }

  commandKey = self.getCommandKey(commandObj);
  isCommand = self.commands.get(commandKey);
  if (isCommand) {
    self.history.add(self.breadcrumbs, self.buffer);
    self.callCommand(commandKey, input);
    return;
  }

  commandKey = self.breadcrumbs.join('.') + commandObj.join('.');
  isMetaCommand = self.metaCommands.get(commandKey);
  if (isMetaCommand) {
    let helpObj = self.getHelpObj(commandKey);
    if (!helpObj) { // @todo
      self.eol();
      self.write(chalk.red(`Command "${commandKey}" is missing subcommands.`), false);
      self.cr();
      return;
    }
    self.history.add(self.breadcrumbs, self.buffer);
    self.breadcrumbs = self.breadcrumbs.concat(commandObj);
    self.eol();
    self.eol();
    self.write(self.formatHelpText(helpObj), false);
    self.cr();
    return;
  }

  // cr for invalid command.
  self.cr();

};

self.initTerminal = (commands, metaCommands, cacheFilename) => {
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  keypress(process.stdin);

  self.history = new History(cacheFilename);
  self.breadcrumbs = [];
  self.buffer = '';
  self.cursorXIndex = 0;

  self.commands = objectInterface(commands);
  self.metaCommands = objectInterface(metaCommands);

  self.callCommand('help');
};

process.stdin.on('data', function (data) {
  data = self.stripData(data);
  if (data) {
    term.deleteLine();
    term.left(self.cursorXIndex); // resets to pos 0.
    let startPos = self.cursorXIndex - self.getDelimiterLength();
    self.buffer = self.buffer.slice(0, startPos) + data + self.buffer.slice(startPos);
    // console.log(1,self.buffer,1);
    self.cursorXIndex = 0;
    self.write(self.getDelimiter());
    self.write(self.buffer, false);
    self.cursorXIndex += startPos + 1;
    // @hack. normalizes the rawMode weirdness.
    term.left(self.cursorXIndex);
    let offset = self.getDelimiterLength() + startPos + 1 - (self.getLineLength() - self.cursorXIndex);
    if (offset > 0) {
      term.right(offset);
    }
    else {
      term.left(Math.abs(offset));
    }
  }
});

process.stdin.on('keypress', function (ch, key) {
  if (!key || !(key.name === 'up' || key.name === 'down')) self.history.reset();
  if (key && key.ctrl && key.name === 'c') {
    self.buffer = '';
    self.cursorXIndex = 0;
    process.stdin.pause();
  }
  else if (key && key.name === 'up') {
    term.down(1); // normalize behavior.
    let item = self.history.next(self.breadcrumbs, self.buffer);
    if (item) {
      term.deleteLine();
      term.left(self.cursorXIndex);
      self.buffer = item;
      self.cursorXIndex = 0;
      self.write(self.getDelimiter());
      self.write(item);
    }
  }
  else if (key && key.name === 'down') {
    let item = self.history.previous(self.breadcrumbs, self.buffer) || '';
    term.deleteLine();
    term.left(self.cursorXIndex);
    self.buffer = item;
    self.cursorXIndex = 0;
    self.write(self.getDelimiter());
    self.write(item);
  }
  else if (key && key.name === 'left') {
    if (self.cursorXIndex > self.getDelimiterLength()) {
      self.cursorXIndex -= 1;
      term.left(1);
    }
  }
  else if (key && key.name === 'right') {
    if (self.cursorXIndex < self.getLineLength()) {
      term.right(1);
      self.cursorXIndex += 1
    }
  }
  else if (key && key.name === 'space') {

  }
  else if (key && key.name === 'delete') { // rev delete (fn + backspace).
    let pos = self.getDelimiterLength() + buffer.length - self.cursorXIndex;
    if (pos > 0) {
      if (pos === 1) {
        self.buffer = self.buffer.slice(0, -1);
      }
      else {
        self.buffer = self.buffer.slice(0, buffer.length - pos) + buffer.slice(buffer.length - pos + 1);
      }
      term.delete(-1);
    }
  }
  else if (key && key.name === 'backspace') {
    if (self.cursorXIndex > self.getDelimiterLength()) {
      let pos = self.getDelimiterLength() + self.buffer.length - self.cursorXIndex;
      if (pos === 0) {
        self.buffer = self.buffer.slice(0, -1);
      }
      else {
        self.buffer = self.buffer.slice(0, pos - 1) + self.buffer.slice(pos);
      }
      term.left(1);
      term.delete(1);
      self.cursorXIndex -= 1;
    }
  }
  else if (key && key.name === 'tab') {
    if (!self.buffer) return;
    let autocompleteText = self.getAutocompleteText();
    if (autocompleteText === self.buffer) {
      let results = self.getAutocompleteText(true);
      if (results) {
        let cr = false;
        // use value to print out command partials. e.g. not "helpers unusedDependencies"
        // just "unusedDependencies" when "helpers" is already in buffer.
        let len = self.buffer.split(' ').length;
        results
          .filter(item => item !== self.buffer)
          .map(item => '-> ' + item.split(' ').slice(len - 1).join(' '))
          .forEach(item => {
            cr = true;
            self.eol();
            self.write(item, false)
          });
        if (cr) {
          self.cr(false);
        }
      }
    }
    else if (autocompleteText) {
      term.deleteLine(1);
      term.left(self.cursorXIndex);
      self.cursorXIndex = 0;
      self.buffer = autocompleteText;
      self.write(self.getDelimiter());
      self.write(autocompleteText);
    }
  }
  else if (key && key.name === 'return') {
    self.runCommand();
  }
});
