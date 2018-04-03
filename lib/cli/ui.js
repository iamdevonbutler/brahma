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
// @file this is basically a bunch of hacks needed to fix the kludge-like terminal UI when in rawMode.

// @todos
// how does help work for a specific command.
// help remote.scale in root errors
// "remote scale" should just die, but it cds into remote.
// validate command name fields and file/dirnames to ensure they dont have "." in the name. also duplicate names.
// alias validation.
// test autocompletion - its buggy.
// backwards delete.
// run status as a precursor to a command main method. choose specific status checks to run and be able to run all of them.
// make private functions _private.
// a command that takes user input.
// doxygen.
// "clear" command.
// change the delimitier w/ a $ to an arrow.

const self = module.exports;

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

// you can only use aliases in ur cwd. so u can run i for install in root. but also i for info inside remote.
self._getNameByAlias = (alias, commands) => {
  var result, prefix;
  prefix = self.breadcrumbs.join('.');
  result = commands
    .find((command, name) => {
      if (command.alias !== alias) return false;
      if (!name.startsWith(prefix)) return false;
      if (name.split('.').length - 1 !== self.breadcrumbs.length) return false;
      return true;
    });
  return result ? result : null;
};

self.getCommandNameByAlias = (alias) => {
  var result = self._getNameByAlias(alias, self.commands);
  return result;
};

self.getMetaCommandNameByAlias = (alias) => {
  var result = self._getNameByAlias(alias, self.metaCommands);
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

self.getCLIInput = () => {
  var input = self.buffer.split(' ').filter(Boolean);
  input = minimist(input);
  return input;
};

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
  if (!commandName) {
    commandName = self.getCommandNameByAlias(command);
  }
  if (commandName) {
    self.history.add(self.breadcrumbs, self.buffer);
    self.commands.call(commandName, input);
    return;
  }

  // Is meta command...
  command = input._.join('.'); // allows for space seperating cd functionality.
  commandName = self.getMetaCommandName(command);
  if (!commandName) {
    commandName = self.getMetaCommandNameByAlias(command);
  }
  if (commandName) {
    self.history.add(self.breadcrumbs, self.buffer);
    self.mergeIntoBreacrumbs(commandName);
    self.cr();
    return;
  }

  // cr for invalid command.
  self.cr();

};

self.getCommandArgs = () => {
  return {
    cli: self.simpleCLIInterface(),
    commands: self.commands.clone(true),
    metaCommands: self.metaCommands.clone(true),
    breadcrumbs: [].concat(self.breadcrumbs),
  };
};

self.decorateCommands = (commands) => {
  var result = commands.map((command, commandName, $command) => {
    return $command.map((property, name) => {
      if (isType(property, 'function') && name !== 'main') {
        return (...args) => {
          var command, result;
          result = property.call(property, {
            self: command,
            ...self.getCommandArgs(),
          }, ...args);
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

self.initTerminal = (commandsPath, cachePath) => {
  var methods, commands, metaCommands;

  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  keypress(process.stdin);

  self.history = new History(cachePath);
  self.breadcrumbs = [];
  self.buffer = '';
  self.cursor = {
    i: 0,
    get() {
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

  methods = {
    call(commandName, input, ...args) {
      var result, command;
      command = self.commands.get(commandName);
      if (!command) return;
      result = command.main.call(command, {
        self: command,
        input,
        ...self.getCommandArgs(),
      }, ...args);
      return result;
    }
  };

  commands = loadCommands(commandsPath);
  metaCommands = loadMetaCommands(commandsPath);

  commands = objectInterface(commands, methods);
  metaCommands = objectInterface(metaCommands);

  self.commands = self.decorateCommands(commands, methods);
  self.metaCommands = self.decorateCommands(metaCommands);

  self.commands.call('help');
};

process.stdin.on('data', function (data) {
  data = self.stripData(data);
  if (data) {
    term.deleteLine();
    term.left(self.cursor.get()); // resets to pos 0.
    let startPos = self.cursor.get() - self.getDelimiterLength();
    self.buffer = self.buffer.slice(0, startPos) + data + self.buffer.slice(startPos);
    self.cursor.reset()
    self.write(self.getDelimiter()); // @todo replace for all instances.
    self.write(self.buffer);
    self.cursor.inc(self.getDelimiterLength());
    self.cursor.inc(startPos + 1);
    // @hack. normalizes the rawMode weirdness.
    term.left(self.cursor.get());
    let offset = self.getDelimiterLength() + startPos + 1 - (self.getLineLength() - self.cursor.get());
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
      term.left(self.cursor.get());
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
    term.left(self.cursor.get());
    self.buffer = item;
    self.cursor.reset();
    self.cursor.inc(self.getDelimiterLength());
    self.cursor.inc(item.length);
    self.write(self.getDelimiter(), false);
    self.write(item);
  }
  else if (key && key.name === 'left') {
    if (self.cursor.get() > self.getDelimiterLength()) {
      self.cursor.dec(1);
      term.left(1);
    }
  }
  else if (key && key.name === 'right') {
    if (self.cursor.get() < self.getLineLength()) {
      term.right(1);
      self.cursor.inc(1);
    }
  }
  else if (key && key.name === 'delete') { // rev delete (fn + backspace).
    let pos = self.getDelimiterLength() + buffer.length - self.cursor.get();
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
    if (self.cursor.get() > self.getDelimiterLength()) {
      let pos = self.getDelimiterLength() + self.buffer.length - self.cursor.get();
      if (pos === 0) {
        self.buffer = self.buffer.slice(0, -1);
      }
      else {
        self.buffer = self.buffer.slice(0, pos - 1) + self.buffer.slice(pos);
      }
      term.left(1);
      term.delete(1);
      self.cursor.dec(1);
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
            self.write(item)
          });
        if (cr) {
          self.cr(false);
        }
      }
    }
    else if (autocompleteText) {
      term.deleteLine(1);
      term.left(self.cursor.get());
      self.buffer = autocompleteText;
      self.cursor.reset();
      self.cursor.inc(self.getDelimiterLength());
      self.cursor.inc(autocompleteText.length);
      self.write(self.getDelimiter());
      self.write(autocompleteText);
    }
  }
  else if (key && key.name === 'return') {
    self.runCommand();
  }
});