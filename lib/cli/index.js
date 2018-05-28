/**
 * @file this is basically a bunch of hacks needed to fix the kludge-like terminal UI when in rawMode.
 */

const {EOL} = require('os');
const objectAssign = require('js-object-assign');
const chalk = require('chalk');
const keypress = require('keypress');
const term = require('terminal-kit').terminal;
const History = require('./history');
const stripAnsi = require('strip-ansi');
const minimist = require('minimist');
const objectInterface = require('js-object-interface');
const isType = require('js-type-checking');
const {getCommonSubstr} = require('../utils');
const {loadCommands, loadMetaCommands} = require('./load');
const path = require('path');

// @todos
// Command-Line Flags:  --prefix ./vendor/node_modules
// build serve (local and for prod - might need to invoke build)
// inject cli utils?

const self = {};

module.exports = (commandsPath, cachePath, config) => {
  var methods, commands, metaCommands, configPath;

  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  keypress(process.stdin);

  self.history = new History(cachePath);
  self.breadcrumbs = [];
  self.buffer = '';
  self.cursor = {
    i: 0,
    pos() {
      return i;
    },
    inc(length) {
      i += length;
    },
    dec(length) {
      i -= length;
    },
    reset() {
      i = 0;
    }
  };

  commands = loadCommands(commandsPath);
  metaCommands = loadMetaCommands(commandsPath);

  // @todo commands and metacommands props are not yet defined.
  methods = {
    call(commandName, input, ...args) {
      var result, command;
      command = self.commands.get(commandName);
      if (!command) return;
      result = command.main.call(command, {
        self: command,
        input,
        config,
        cli: self.simpleCLIInterface(),
        commands: self.commands.clone(true),
        metaCommands: self.metaCommands.clone(true),
        breadcrumbs: [].concat(self.breadcrumbs),
      }, ...args);
      return result;
    }
  };

  commands = objectInterface(commands, methods);
  metaCommands = objectInterface(metaCommands, methods);

  self.commands = self.decorateCommands(commands, config);
  self.metaCommands = self.decorateCommands(metaCommands, config);

  self.commands.call('help');
};

self.getDelimiterLength = () => {
  var length =  2 + 'brahma'.length + (self.breadcrumbs.length ? self.breadcrumbs.join(' ').length + 2 : 1);
  return length;
};

self.getDelimiter = () => {
  var delimiter = `${chalk.magenta('\u25CF')} brahma${self.breadcrumbs.length ? ' ' + chalk.dim(self.breadcrumbs.join(' ')) : ''} `;
  return delimiter;
};

self.getLineLength = () => {
  var length = self.getDelimiterLength() + self.buffer.length;
  return length;
};

self.write = (data) => {
  term(data);
};

self.eol = () => {
  self.write(EOL);
};

/*
 * @param {Boolean} clearBuffer = true
 * @param {Boolean} EOL = true
 * @return {undefined}
 */
self.cr = (clearBuffer = true, eol = true) => {
  var delimiter;
  delimiter = self.getDelimiter();
  self.cursor.reset();
  self.cursor.inc(self.getDelimiterLength());
  if (clearBuffer) self.buffer = '';
  if (eol) self.eol();
  self.write(delimiter);
  if (!clearBuffer) {
    self.write(self.buffer);
    self.cursor.inc(self.buffer.length);
  }
};

/**
 * Remove ANIS escape sequences and non letter characters (!a-z) from string.
 * @param  {String} data
 * @return {String|null}
 */
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

/**
 * Find matching command from CLI input considering breadcrumbs.
 * @param  {String} command
 * @param  {$Object} commands
 * @return {String|null}
 */
self._getName = (command, commands) => {
  var prefix, commandName, result;
  prefix = self.breadcrumbs.join('.');
  commandName = prefix ? prefix + '.' + command : command;
  result = !!commands.get(commandName) ? commandName : null;
  return result;
};

self.getCommandName = (command) => {
  var result = self._getName(command, self.commands);
  return result;
};

self.getMetaCommandName = (command) => {
  var result = self._getName(command, self.metaCommands);
  return result;
};

self.isNavigateBack = (command) => {
  var navigateBack = command.split('/').every(item => item === '..');
  return navigateBack;
};

self.navigateBack = (command) => {
  self.breadcrumbs.splice(-command.split('/').filter(Boolean).length);
  self.cr();
};

// CLI interface to be injected in commands.
// You have the power that you need.
self.simpleCLIInterface = () => {
  return {
    cr: self.cr,
    eol: self.eol,
    write(data) {
      self.eol();
      self.write(data);
      self.cr();
    }
  };
};

self.getCLIInput = () => {
  var input = self.buffer.split(' ').filter(Boolean);
  input = minimist(input);
  return input;
};

// @todo kludge
self.mergeIntoBreacrumbs = (commandName) => {
  var commandObj = commandName.split('.');
  commandObj.forEach((commandName, i) => {
    if (!self.breadcrumbs[i] && self.breadcrumbs.length < commandObj.length) {
      self.breadcrumbs.push(commandName);
    }
  });
};

self.runCommand = () => {
  var input, command, commandName;

  if (!self.buffer) {
    self.cr();
    return;
  }

  input = self.getCLIInput();
  command = input._[0];

  // cd back via: .. | ../[../]
  if (self.isNavigateBack(self.buffer)) {
    self.history.add(self.breadcrumbs, self.buffer);
    self.navigateBack(self.buffer);
    return;
  }

  // Exit brahma.
  if (command === 'exit') {
    process.stdin.pause();
    return;
  }

  // Clear terminal.
  if (command === 'clear') {
    term.clear();
    self.cr(true, false);
    return;
  }

  // Help command can be called from all meta directories.
  if (command === 'help' || command === 'h') {
    self.history.add(self.breadcrumbs, self.buffer);
    self.eol();
    self.commands.call('help', input);
    return;
  }

  // Is regular command...
  commandName = self.getCommandName(command);
  if (commandName) {
    self.history.add(self.breadcrumbs, self.buffer);
    self.commands.call(commandName, input);
    return;
  }

  // Is meta command...
  // command = input._.join('.'); // allows for space seperating cd functionality. @todo enable/disable?
  commandName = self.getMetaCommandName(command);
  if (commandName) {
    self.history.add(self.breadcrumbs, self.buffer);
    self.mergeIntoBreacrumbs(commandName); // @todo change name.
    self.cr();
    return;
  }

  // cr for invalid command.
  self.cr();

};

/**
 * Proxy function calls to a decorator that injects an obj of utility data
 * as param1, and spreads out the remaining args.
 * @param  {Object objectInterface} commands
 * @return {Object}
 */
self.decorateCommands = (commands, ...args) => {
  var result = commands.map((command, commandName, $command) => {
    return $command.map((property, name) => {
      if (isType(property, 'function') && name !== 'main') {
        return (...args1) => {
          var command, result;
          result = property.call(property, {
            self: command,
            cli: self.simpleCLIInterface(),
            commands: self.commands.clone(true),
            metaCommands: self.metaCommands.clone(true),
            breadcrumbs: [].concat(self.breadcrumbs),
            ...args,
          }, ...args1);
          return result;
        };
      }
      else {
        return property;
      }
    });
  }, true);
  return result;
};

self.getAutocompleteText = (returnMultiple = false) => {
  var result;
  function findMatches(input) {
    var commands, prefix, result;
    commands = self.commands.keys().concat(self.metaCommands.keys());
    prefix = self.breadcrumbs.join('.');
    result = commands
      .filter(item => {
        if (prefix) {
          let str = input ? prefix + '.' + input : prefix;
          let len = self.breadcrumbs.length + (input.split('.').length - 1);
          if (!item.startsWith(str)) return false;
          if (item === str) return false;
          if (item.split('.').length - 1 !== len) return false;
          return true;
        }
        else {
          if (!item.startsWith(input)) return false;
          if (item === input) return false;
          if (item.split('.').length !== input.split('.').length) return false;
          return true;
        }
      })
      .map(item => {
        return prefix ? item.slice(prefix.length + 1 /* +1 for trailing "." */) : item;
      });

    return result && result.length ? result : null;
  };

  result = findMatches(self.buffer);
  if (!result) result = findMatches(self.buffer + '.');
  if (!result) return null;

  if (returnMultiple) return result && result.length ? result : null;

  if (result.length === 1) {
    result = result[0];
  }
  else if (result.length > 1) {
    result = result.reduce((p, c) => getCommonSubstr(p, c));
  }

  return result && result.length ? result : null;
};

self.suggestCommand = () => {
  function printResults(results) {
    // use value to print out command partials. e.g. not "helpers unusedDependencies"
    // just "unusedDependencies" when "helpers" is already in buffer.
    var len = self.buffer.split('.').length;
    results
      .map(item => '-> ' + item.split('.').slice(len - 1).join('.'))
      .forEach(item => {
        self.eol();
        self.write(item);
      });
    self.cr(false);
  };

  if (!self.buffer) {
    let results = self.getAutocompleteText(true);
    if (results) printResults(results);
    return;
  }

  let autocompleteText = self.getAutocompleteText();
  if (autocompleteText === self.buffer) {
    let results = self.getAutocompleteText(true); // true returns multiple results.
    if (results) {
      printResults(results);
      return;
    }
  }
  else if (autocompleteText) {
    term.deleteLine(1);
    term.left(self.cursor.pos());
    self.buffer = autocompleteText;
    self.cursor.reset();
    self.cursor.inc(self.getDelimiterLength());
    self.cursor.inc(autocompleteText.length);
    self.write(self.getDelimiter());
    self.write(autocompleteText);
  }
};

process.stdin.on('data', function (data) {
  data = self.stripData(data);
  if (data) {
    term.deleteLine();
    term.left(self.cursor.pos()); // resets to pos 0.
    let startPos = self.cursor.pos() - self.getDelimiterLength();
    self.buffer = self.buffer.slice(0, startPos) + data + self.buffer.slice(startPos);
    self.cursor.reset();
    self.write(self.getDelimiter());
    self.write(self.buffer);
    self.cursor.inc(self.getDelimiterLength());
    self.cursor.inc(startPos + 1);
    // @hack. normalizes the rawMode weirdness.
    term.left(self.cursor.pos());
    let offset = self.getDelimiterLength() + startPos + 1 - (self.getLineLength() - self.cursor.pos());
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
    process.stdin.pause();
  }
  else if (key && key.name === 'up') {
    let item = self.history.next(self.breadcrumbs, self.buffer);
    if (item) {
      term.deleteLine();
      term.left(self.cursor.pos());
      self.buffer = item;
      self.cursor.reset();
      self.cursor.inc(self.getDelimiterLength())
      self.cursor.inc(item.length)
      self.write(self.getDelimiter());
      self.write(item);
    }
  }
  else if (key && key.name === 'down') {
    let item = self.history.previous(self.breadcrumbs, self.buffer) || '';
    term.deleteLine();
    term.left(self.cursor.pos());
    self.buffer = item;
    self.cursor.reset();
    self.cursor.inc(self.getDelimiterLength());
    self.cursor.inc(item.length);
    self.write(self.getDelimiter());
    self.write(item);
  }
  else if (key && key.name === 'left') {
    if (self.cursor.pos() > self.getDelimiterLength()) {
      self.cursor.dec(1);
      term.left(1);
    }
  }
  else if (key && key.name === 'right') {
    if (self.cursor.pos() < self.getLineLength()) {
      term.right(1);
      self.cursor.inc(1);
    }
  }
  else if (key && key.name === 'backspace') {
    let pos = self.cursor.pos() - self.getDelimiterLength();
    if (pos > 0) {
      self.buffer = self.buffer.slice(0, pos - 1) + self.buffer.slice(pos);
      term.left(1);
      term.delete(1);
      self.cursor.dec(1);
    }
  }
  else if (key && key.name === 'delete') { // rev delete (fn + backspace).
    if (self.cursor.pos() < self.getLineLength()) {
      let pos = self.cursor.pos() - self.getDelimiterLength();
      self.buffer = self.buffer.slice(0, pos) + self.buffer.slice(pos + 1);
      term.delete(-1);
    }
  }
  else if (key && key.name === 'tab') {
    self.suggestCommand();
  }
  else if (key && key.name === 'return') {
    self.runCommand();
  }
});
