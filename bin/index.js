#!/usr/bin/env node

const vorpal = require('vorpal')();
const path = require('path');
const {fileExists} = require('../lib/utils');
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
const newProject = require('../lib/commands/new');
const test = require('../lib/commands/test');
const add = require('../lib/commands/add');

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

// Load apps config.
const configPath = path.join(process.cwd(), 'brahma.apps.js');
if (!fileExists(configPath)) {
  console.error('Add a "./brahma.apps.js" file.');
  return;
}
state.apps = loadAppsConfig(configPath, state.env);

// Load env.
const envPath = path.join(process.cwd(), 'brahma.env.js');
state.env = loadEnv(envPath, state.apps);

// Load variables.
const variablesPath = path.join(process.cwd(), 'brahma.config.js');
state.variables = loadVariables(variablesPath, state.env);

// `state` live update during runtime.
chokidar
  .watch(path.join(process.cwd(), 'brahma.apps.js'))
  .on('change', () => {
    state.apps = loadAppsConfig(configPath, state.env);
  });

chokidar
  .watch(path.join(process.cwd(), 'brahma.env.js'))
  .on('change', () => {
    state.env = loadEnv(envPath, state.apps);
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

// Utility functions.
function logArray(obj, error = false) {
  if (error) {
    console.error(obj.map(item => '-> ' + chalk.red(item)).join('\n'));
  }
  else {
    console.log(obj.map(item => '-> ' + item).join('\n'));
  }
};

// Register commands w/ vorpal.
vorpal
  .command('status')
  .action(async args => {
    var {errors, info} = await status(state)(args);
    if (info) logArray(info);
    if (errors) logArray(errors, true);
    return errors;
  });

vorpal
  .command('build')
  .action(async args => {
    const startTime = Date.now();
    var {info, errors} = await status(state)(args);
    if (errors) {
      console.log('Status errors:');
      logArray(errors, true);
    }
    else {
      var {info, errors} = await build(state)(args);
      if (info) logArray(info);
      if (errors) logArray(errors, true);
      console.log(`-> Build time (${Date.now() - startTime}ms)`);
    }
    return errors;
  });

vorpal
  .command('deploy')
  .action(async args => {
    var {info, errors} = await build(state)(args);
    if (errors) {
      console.log('Build errors:');
      logArray(errors, true);
    }
    else {
      var {info, errors} = await deploy(state)(args);
      if (info) logArray(info);
      if (errors) logArray(errors, true);
    }
    return errors;
  });

vorpal
  .command('serve')
  .action(async args => {
    var {info, errors} = await build(state)(args);
    if (errors) {
      console.log('Build errors:');
      logArray(errors, true);
    }
    else {
      var {info, errors} = await serve(state)(args);
      if (info) logArray(info);
      if (errors) logArray(errors, true);
    }
    return errors;
  });

// vorpal
//   .command('watch')
//   .action();

// vorpal
//   .command('new')
//   .action(new);
//
// vorpal
//   .command('test')
//   .action(test);

//   // vorpal
//   .command('add')
//   .action(add);

// Display vorpal in terminal.
vorpal
  .delimiter(state.settings.delimiter)
  .show()
  .exec('help');
