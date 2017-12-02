#!/usr/bin/env node

const vorpal = require('vorpal')();
const path = require('path');
const {fileExists, runBefore, log} = require('../lib/utils');
const chalk = require('chalk');
const chokidar = require('chokidar');

const loadAppsConfig = require('../lib/utils/loadAppsConfig');
const loadSettings = require('../lib/utils/loadSettings');
const loadVariables = require('../lib/utils/loadVariables');
const loadEnv = require('../lib/utils/loadEnv');

const status = require('../lib/commands/status');
const serve = require('../lib/commands/serve');
const watch = require('../lib/commands/watch');
const build = require('../lib/commands/build');
const deploy = require('../lib/commands/deploy');
const scafold = require('../lib/commands/scafold');
const test = require('../lib/commands/test');

const state = {};

// Error handling.
process.on('unhandledRejection', console.error);

// Node version check.
const majorVersion = +process.version.slice(1).split('.')[0];
if (majorVersion < 9) {
  console.error('Brahma requires node version >= 9.0.0');
  return;
}

// Load Settings.
const settingsPath = path.join(process.cwd(), 'brahma.settings.js');
if (!fileExists(settingsPath)) {
  console.error('Add a "./brahma.settings.js" file.');
  return;
}
state.settings = loadSettings(settingsPath);

// Get active env.
state.activeEnv = process.argv[2] || state.settings.localEnvironment;
console.log(chalk.yellow(`Active environment: "${state.activeEnv}".`));

// Load config.
const configPath = path.join(process.cwd(), 'brahma.apps.js');
if (!fileExists(configPath)) {
  console.error('Add a "./brahma.apps.js" file.');
  return;
}
state.config = loadAppsConfig(configPath, state.env);

// Load env.
const envPath = path.join(process.cwd(), 'brahma.env.js');
state.env = loadEnv(envPath, state.config);

// Load variables.
const variablesPath = path.join(process.cwd(), 'brahma.config.js');
state.variables = loadVariables(variablesPath, state.env);

// `state` live update during runtime.
chokidar
  .watch(path.join(process.cwd(), 'brahma.apps.js'))
  .on('change', () => {
    state.config = loadAppsConfig(configPath, state.env);
  });

chokidar
  .watch(path.join(process.cwd(), 'brahma.env.js'))
  .on('change', () => {
    state.env = loadEnv(envPath, state.config);
  });

chokidar
  .watch(path.join(process.cwd(), 'brahma.settings.js'))
  .on('change', () => {
    state.settings = loadSettings(settingsPath);
  });

chokidar
  .watch(path.join(process.cwd(), 'brahma.config.js'))
  .on('change', () => {
    state.variables = loadVariables(variablesPath, state.env);
  });

// Register commands w/ vorpal.
vorpal
  .command('status')
  .action(async args => {
    return await status(state)(args);
  });

vorpal
  .command('build')
  .action(async args => {
    var valid = await status(state)(args);
    if (valid) {
      return await build(state)(args);
    }
  });

vorpal
  .command('deploy')
  .action(async args => {
    var valid = await build(state)(args);
    if (valid) {
      return deploy(state)(args);
    }
  });

vorpal
  .command('serve')
  .action(async args => {
    var valid = await build(state)(args);
    if (valid) {
      return await serve(state)(args);
    }
  });

// vorpal
//   .command('watch')
//   .action();

// vorpal
//   .command('scafold')
//   .action(scafold);
//
// vorpal
//   .command('test')
//   .action(test);

// Display vorpal in terminal.
vorpal
  .delimiter(state.settings.delimiter)
  .show()
  .exec('help');
