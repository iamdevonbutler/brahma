#!/usr/bin/env node

const path = require('path');
const {fileExists, logArray, cols} = require('../lib/utils');
const chalk = require('chalk');
const chokidar = require('chokidar');
const {EOL} = require('os');
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

// Set encoding for when we read from stdin.
process.stdin.setEncoding('utf8');

// Node version check.
const majorVersion = +process.version.slice(1).split('.')[0];
if (majorVersion < 9) {
  logError('Brahma requires node version >= 9.0.0');
  return;
}









const loadCommands = require('../lib/load/loadCommands');
// const objectInterface = require('js-object-interface');

var breadcrumbs = [];
var commandsPath = path.resolve(__dirname, '../lib/commands');
var commands = loadCommands(commandsPath);

function getHelpText(commands) {
  var obj = Object.keys(commands).map(key => ([
    '    ' + commands[key].name,
    '    ' + commands[key].description,
  ]));
  return `${EOL}  Commands:${EOL}${EOL}${cols(obj, 25)}`;
};

function cr() {
  process.stdout.write(`${EOL}$brahma${breadcrumbs.length ? '.' : ''}${chalk.dim(breadcrumbs.join('.'))}: `);
}

// if you just type in a command it prints the help for that command, same for all subcommands.
// Infinant number of subcommands.
// command plugins and subcommand extensions need a way to hook into help
// breadcrumbs $brahma: | $brahma.helpers | $brahma.helpers.doThing and maybe a way to navigate back (cmd+left) @todo document
// autocomplete functionality
// load commands needs to load project commands too. let user overwrite brahma commands, so they can make their own remote command for instance.
// how does help work w. subcommands

process.stdin.on('data', function (data) {
  var command = data.replace(EOL, '');
  var commandNames = Object.keys(commands);
  if (commandNames.indexOf(command) > -1) {
    breadcrumbs.push(command);
    let subcommandsPath = path.join(commandsPath, command, 'commands');
    let subcommands = loadCommands(subcommandsPath);
    process.stdout.write(getHelpText(subcommands));
    cr();
  }
  else if (command.split('/').every(item => '..')) {
    breadcrumbs.splice(-command.split('/').length);
    cr();
  }
  else {
    process.stdout.write(`Invalid command (${command})`);
    cr();
  }
});

// process.stdout.write();
process.stdout.write(getHelpText(commands) + '\n');
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
