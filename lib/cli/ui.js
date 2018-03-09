const {EOL} = require('os');
const chalk = require('chalk');
const keypress = require('keypress');
const term = require('terminal-kit').terminal;
const History = require('./history');
const stripAnsi = require('strip-ansi');
const minimist = require('minimist');
const objectInterface = require('js-object-interface');

// caching.
// if you just type in a command it prints the help for that command, same for all subcommands.
// Infinant number of subcommands. test.
// command plugins and subcommand extensions need a way to hook into help
// breadcrumbs $brahma: | $brahma.helpers | $brahma.helpers.doThing and maybe a way to navigate back (cmd+left) @todo document
// autocomplete functionality
// load commands needs to load project commands too. let user overwrite brahma commands, so they can make their own remote command for instance.

// @note this is basically a bunch of hacks needed to fix the kludge-like terminal UI when in rawMode.

const self = module.exports;

self.cols = (rows, ...widths) => {
  var str = '';
  rows.forEach(row => {
    row.forEach((item, i) => {
      if (widths[i]) {
        if (item.length > widths[i]) {
          item = item.slice(0, widths[i]) + EOL + item.slice(widths[i])
        }
        else {
          let padding = widths[i] - item.length;
          while (padding--) {
            item += ' ';
          }
        }
      }
      str += item;
    });
    str += EOL;
  });
  return str;
};

self.formatHelpText = (commands) => {
  var obj = Object.keys(commands).map(key => ([
    '    ' + commands[key].name,
    '    ' + commands[key].description,
  ]));
  return `  Commands:${EOL}${EOL}${self.cols(obj, 25)}`;
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

self.write = (data, incrementCursor = true) => {
  if (incrementCursor) {
    self.cursorXIndex += data.length;
  }
  term(data);
};

self.cr = () => {
  var delimiter;
  self.buffer = '';
  self.cursorXIndex = self.getDelimiterLength();
  delimiter = self.getDelimiter();
  self.write(EOL, false);
  self.write(delimiter, false);
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
    helpObj = self.commandMetadata.filter((item, metaName) => {
      return key.split('.').length + 1 === metaName.split('.').length && metaName.startsWith(key);
    });
  }
  return helpObj;
};

self.callCommand = (commandKey, data) => {
  data = data || '';
  self.commands.get(commandKey).main.call(null, {
    data,
    cli: self.simpleInterface(),
  });
};

// CLI interface to be injected in commands.
// You have the power that you need.
self.simpleInterface = () => {
  return {
    commands: commands,
    meta: commandMetadata,
    write(data) {
      self.write(EOL, false);
      self.write(data, false);
      self.cr();
    }
  };
};

// help text w/ examples and other fields for commands.
// flat outer command. install. what if u had a flat outer command for remote.scale.
// how to name nested commands. is the name for remote.info info or remote.info?
// command aliases. function and documentation
// inject a simplified CLI into callCommand, e.g. write doesnt fuck up buffer and shit.
// tab fixes.
// commands.get('remote.env').main.call(null); - should resources interface differ, update.
// commands.get('remote.env').main.call(null); - main.call w/ ctx, cant pass in ctx, using `this` is important to access obj data.
self.runCommand = () => {
  if (!self.buffer) return;

  var input = self.buffer.split(' ').filter(Boolean);

  // cd back via: .. | ../[../]
  if (self.isNavigateBack(self.buffer)) {
    self.history.add(self.breadcrumbs, self.buffer);
    self.navigateBack(self.buffer);
    return;
  }
  // cd into command.
  else if (input.length === 1) {
    let commandKey = self.breadcrumbs.concat(input[0]).join('.');

    let isCommand = self.commands.get(commandKey);
    if (isCommand) {
      self.callCommand(commandKey, null);
      self.cr();
      return;
    }

    let isMetaCommand = self.commandMetadata.get(commandKey);
    if (isMetaCommand) {
      let helpObj = self.getHelpObj(commandKey);
      if (!helpObj) {
        self.write(EOL, false);
        self.write(chalk.red(`Command "${commandKey}" is missing subcommands.`), false);
        self.cr();
        return;
      }
      self.history.add(self.breadcrumbs, input[0]);
      self.breadcrumbs.push(input[0]);
      self.write(EOL, false);
      self.write(EOL, false);
      self.write(self.formatHelpText(helpObj), false);
      self.cr();
      return;
    }
  }
  // command [command] [value] [--flags]
  else {
    let commandKey = self.getCommandKey(input);
    if (commandKey) {
      self.history.add(self.breadcrumbs, input.join(' '));
      let commandArgsOffset = commandKey.split('.').length - breadcrumbs.length;
      let data = input.slice(commandArgsOffset);
      self.callCommand(commandKey, data);
      self.cr();
    }
  }
};

self.initTerminal = (commands, commandMetadata, cacheFilename) => {
  var helpObj;

  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  keypress(process.stdin);

  self.history = new History(cacheFilename);
  self.breadcrumbs = [];
  self.buffer = '';
  self.cursorXIndex = 0;

  self.commands = objectInterface(commands);
  self.commandMetadata = objectInterface(commandMetadata);

  helpObj = self.commandMetadata.filter((item, key) => key.split('.').length === 1);
  self.write(EOL, false);
  self.write(self.formatHelpText(helpObj), false);
  self.cr();
};

process.stdin.on('data', function (data) {
  data = self.stripData(data);
  if (data) {
    self.buffer += data;
    self.write(data);
  }
});

process.stdin.on('keypress', function (ch, key) {
  if (!key || !(key.name === 'up' || key.name === 'down')) self.history.reset();
  if (key && key.ctrl && key.name === 'c') {
    self.buffer = '';
    process.stdin.pause();
  }
  else if (key && key.name === 'up') {
    term.down(1);
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
    let length = getLineLength();
    if (self.cursorXIndex < length) {
      term.right(1);
      self.cursorXIndex += 1
    }
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
      term.delete();
      self.cursorXIndex -= 1;
    }
  }
  else if (key && key.name === 'tab') {
    // @todo not working.
    if (!self.buffer) return
    let commandKeys = self.commands.keys();
    let commands = commandKeys.filter(item => item.startsWith(self.buffer));
    if (commands.length === 1) {
      term.deleteLine(self.buffer.length);
      term.left(self.cursorXIndex);
      self.cursorXIndex = 0;
      self.buffer = commands[0];
      self.write(self.getDelimiter());
      self.write(commands[0]);
    }
  }
  else if (key && key.name === 'return') {
    self.runCommand();
  }
});
