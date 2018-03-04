#!/usr/bin/env node

const path = require('path');
const {fileExists, logArray, cols} = require('../lib/utils');
const chalk = require('chalk');
const chokidar = require('chokidar');
const {EOL} = require('os');
const keypress = require('keypress');
const term = require( 'terminal-kit' ).terminal;
const stripAnsi = require('strip-ansi');

// const objectInterface = require('js-object-interface');

// const loadAppsConfig = require('../lib/load/loadAppsConfig');
// const loadSettings = require('../lib/load/loadSettings');
// const loadVariables = require('../lib/load/loadVariables');
// const loadEnv = require('../lib/load/loadEnv');

// const status = require('../lib/commands/status');
// const serve = require('../lib/commands/serve');
// const build = require('../lib/commands/build');
// const remote = require('../lib/commands/remote');
// const newProject = require('../lib/commands/new');
// const test = require('../lib/commands/test');
// const add = require('../lib/commands/add');
// const helpers = require('../lib/commands/helpers');

const state = {};

// Error handling.
process.on('unhandledRejection', console.error);

// Init terminal settings.
process.stdin.setEncoding('utf8');
process.stdin.setRawMode(true);
keypress(process.stdin);

// Node version check.
const majorVersion = +process.version.slice(1).split('.')[0];
if (majorVersion < 9) {
  logError('Brahma requires node version >= 9.0.0');
  return;
}








// if you just type in a command it prints the help for that command, same for all subcommands.
// Infinant number of subcommands.
// command plugins and subcommand extensions need a way to hook into help
// breadcrumbs $brahma: | $brahma.helpers | $brahma.helpers.doThing and maybe a way to navigate back (cmd+left) @todo document
// autocomplete functionality
// load commands needs to load project commands too. let user overwrite brahma commands, so they can make their own remote command for instance.
// how does help work w. subcommands
// abstract out terminal UI. make functional and pure, no closure. use singleton object pattern to allow access to data vars.

const loadCommands = require('../lib/load/loadCommands');
// const objectInterface = require('js-object-interface');

var breadcrumbs = [];
var history = [];
var buffer = '';
var cursorXIndex = 0;
var commandsRootPath = path.resolve(__dirname, '../lib/commands');

function getHelpText(commands) {
  var obj = Object.keys(commands).map(key => ([
    '    ' + commands[key].name,
    '    ' + commands[key].description,
  ]));
  return `  Commands:${EOL}${EOL}${cols(obj, 25)}`;
};

function getDelimiterLength() {
  var length = '$brahma'.length + (breadcrumbs.length ? breadcrumbs.join('.').length + 3 : 2);
  return length;
};

function getDelimiter() {
  var delimiter = `$brahma${breadcrumbs.length ? '.' : ''}${chalk.dim(breadcrumbs.join('.'))}: `;
  return delimiter;
};

function getLineLength() {
  var length = getDelimiterLength() + buffer.length;
  return length;
};

function write(data, incrementCursor = true) {
  if (incrementCursor) {
    cursorXIndex += data.length;
  }
  term(data);
};

function cr() {
  buffer = '';
  cursorXIndex = getDelimiterLength()
  var delimiter = getDelimiter();
  write(EOL, false);
  write(delimiter, false);
};

function stripData(data) {
  data = stripAnsi(data) + '';
  if (data) {
    let asciiCode = data.charCodeAt(0);
    if ([127, 13].indexOf(asciiCode) > -1) {
      return null;
    }
  }
  return data || null;
}

function addHistoryItem(obj) {
  history = history.filter(item => item !== obj);
  history.push(obj);
};


function getHistoryItem(str) {
  var obj;
  if (str) {
    obj = history.find(item => item.indexOf(str) === 0);
  }
  else {
    obj = history[history.length - 1];
  }
  return obj;
};

process.stdin.on('data', function (data) {
  data = stripData(data);
  if (data) {
    buffer += data;
    write(data);
  }
});

process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name === 'c') {
    buffer = '';
    process.stdin.pause();
  }
  else if (key && key.name === 'up') {
    term.down(1);
    let item = getHistoryItem(buffer);
    if (item) {
      term(item);
    }
  }
  else if (key && key.name === 'down') {
    // term();
  }
  else if (key && key.name === 'left') {
    if (cursorXIndex > getDelimiterLength()) {
      cursorXIndex -= 1;
      term.left(1);
    }
  }
  else if (key && key.name === 'right') {
    let length = getLineLength();
    if (cursorXIndex < length) {
      term.right(1);
      cursorXIndex += 1
    }
  }
  else if (key && key.name === 'space') {
    cursorXIndex += 1;
  }
  else if (key && key.name === 'delete') { // rev delete (fn + backspace).
    let pos = getDelimiterLength() + buffer.length - cursorXIndex;
    if (pos > 0) {
      if (pos === 1) {
        buffer = buffer.slice(0, -1);
      }
      else {
        buffer = buffer.slice(0, buffer.length - pos) + buffer.slice(buffer.length - pos + 1);
      }
      term.delete(-1);
    }
  }
  else if (key && key.name === 'backspace') {
    // console.log(cursorXIndex, getDelimiterLength());
    if (cursorXIndex > getDelimiterLength()) {
      let pos = getDelimiterLength() + buffer.length - cursorXIndex;
      if (pos === 0) {
        buffer = buffer.slice(0, -1);
      }
      else {
        buffer = buffer.slice(0, pos - 1) + buffer.slice(pos);
      }
      term.left(1);
      term.delete();
      cursorXIndex -= 1;
    }
  }
  else if (key && key.name === 'tab') {
    console.log(buffer);

  }
  else if (key && key.name === 'return') {
    handleReturn();
  }
});

function handleReturn() {
  var command = buffer;
  var commandsPath = path.join(commandsRootPath, ...breadcrumbs.reduce((p, c) => {
    p.push(c);
    p.push('commands');
    return p;
  }, []));
  var commands = loadCommands(commandsPath);
  var commandNames = Object.keys(commands);
  if (commandNames.indexOf(command) > -1) {
    breadcrumbs.push(command);
    let subcommandsPath = path.join(commandsPath, command, 'commands');
    let subcommands = loadCommands(subcommandsPath);
    write(EOL, false);
    write(EOL, false);
    write(getHelpText(subcommands), false);
    addHistoryItem(command);
    cr();
  }
  else if (command.split('/').every(item => item === '..')) {
    breadcrumbs.splice(-command.split('/').length);
    cr();
  }
  else {
    cr();
  }
};

var commands = loadCommands(commandsRootPath);
write(EOL, false);
write(getHelpText(commands), false);
cr();










return;



// Load Settings.
const settingsPath = path.join(process.cwd(), 'config/settings.js');
if (!fileExists(settingsPath)) {
  console.error('Add a "./config/settings.js" file.');
  return;
}
state.settings = loadSettings(settingsPath);

// Get active env.
// state.activeEnv = process.argv[2] || state.settings.localEnvironment;
// console.log(chalk.yellow(`Active environment: "${state.activeEnv}".`));

// Load apps config.
const configPath = path.join(process.cwd(), 'config/apps.js');
if (!fileExists(configPath)) {
  console.error('Add a "./config/apps.js" file.');
  return;
}
state.apps = loadAppsConfig(configPath, state.env);

// Load env.
const envPath = path.join(process.cwd(), 'config/env.js');
// state.env = loadEnv(envPath, state.apps);


// does the resource encapsulate update functionality - hooks that respond to update activty?
state.env = objectInterface(loadEnv(envPath, state.apps), require('../lib/config/env'));


// Load variables.
const variablesPath = path.join(process.cwd(), 'config/variables.js');
state.variables = loadVariables(variablesPath, state.env);

// live update `state` during runtime.
chokidar
  .watch(path.join(process.cwd(), 'config/apps.js'))
  .on('change', () => {
    state.apps = loadAppsConfig(configPath, state.env);
  });

chokidar
  .watch(path.join(process.cwd(), 'config/env.js'))
  .on('change', () => {
    state.env = loadEnv(envPath, state.apps);
  });

chokidar
  .watch(path.join(process.cwd(), 'config/settings.js'))
  .on('change', () => {
    state.settings = loadSettings(settingsPath);
  });

chokidar
  .watch(path.join(process.cwd(), 'config/variables.js'))
  .on('change', () => {
    state.variables = loadVariables(variablesPath, state.env);
  });
