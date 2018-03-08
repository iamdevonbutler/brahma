#!/usr/bin/env node

const path = require('path');
// const {fileExists, logArray} = require('../lib/utils');
// const chalk = require('chalk');
// const chokidar = require('chokidar');
// const objectInterface = require('js-object-interface');

const {loadCommands, loadCommandMetadata} = require('../lib/load/loadCommands');
const commandsRootPath = path.resolve(__dirname, '../lib/commands');
const {initTerminal} = require('../lib/cli/ui');

// const loadAppsConfig = require('../lib/load/loadAppsConfig');
// const loadSettings = require('../lib/load/loadSettings');
// const loadVariables = require('../lib/load/loadVariables');
// const loadEnv = require('../lib/load/loadEnv');

// const state = {};

// Error handling.
process.on('unhandledRejection', console.error);

// Node version check.
const majorVersion = +process.version.slice(1).split('.')[0];
if (majorVersion < 9) {
  logError('Brahma requires node version >= 9.0.0');
  return;
}

var commands = loadCommands(commandsRootPath);
var commandMetadata = loadCommandMetadata(commandsRootPath);
var cacheFilename = path.resolve(__dirname, '../cache/cli-history.js');
initTerminal(commands, commandMetadata, cacheFilename);

return;

// Load Settings.
// const settingsPath = path.join(process.cwd(), 'config/settings.js');
// if (!fileExists(settingsPath)) {
//   console.error('Add a "./config/settings.js" file.');
//   return;
// }
// state.settings = loadSettings(settingsPath);

// Get active env.
// state.activeEnv = process.argv[2] || state.settings.localEnvironment;
// console.log(chalk.yellow(`Active environment: "${state.activeEnv}".`));

// Load apps config.
// const configPath = path.join(process.cwd(), 'config/apps.js');
// if (!fileExists(configPath)) {
//   console.error('Add a "./config/apps.js" file.');
//   return;
// }
// state.apps = loadAppsConfig(configPath, state.env);
//
// // Load env.
// const envPath = path.join(process.cwd(), 'config/env.js');
// // state.env = loadEnv(envPath, state.apps);
//
//
// // does the resource encapsulate update functionality - hooks that respond to update activty?
// state.env = objectInterface(loadEnv(envPath, state.apps), require('../lib/config/env'));
//
//
// // Load variables.
// const variablesPath = path.join(process.cwd(), 'config/variables.js');
// state.variables = loadVariables(variablesPath, state.env);
//
// // live update `state` during runtime.
// chokidar
//   .watch(path.join(process.cwd(), 'config/apps.js'))
//   .on('change', () => {
//     state.apps = loadAppsConfig(configPath, state.env);
//   });
//
// chokidar
//   .watch(path.join(process.cwd(), 'config/env.js'))
//   .on('change', () => {
//     state.env = loadEnv(envPath, state.apps);
//   });
//
// chokidar
//   .watch(path.join(process.cwd(), 'config/settings.js'))
//   .on('change', () => {
//     state.settings = loadSettings(settingsPath);
//   });
//
// chokidar
//   .watch(path.join(process.cwd(), 'config/variables.js'))
//   .on('change', () => {
//     state.variables = loadVariables(variablesPath, state.env);
//   });
