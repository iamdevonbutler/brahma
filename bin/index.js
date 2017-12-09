#!/usr/bin/env node

const Vorpal = require('vorpal');
const path = require('path');
const {fileExists, forEach, map, reduce} = require('../lib/utils');
const chalk = require('chalk');
const chokidar = require('chokidar');
const {EOL} = require('os');

const loadAppsConfig = require('../lib/load/loadAppsConfig');
const loadSettings = require('../lib/load/loadSettings');
const loadVariables = require('../lib/load/loadVariables');
const loadEnv = require('../lib/load/loadEnv');

const status = require('../lib/commands/status');
const serve = require('../lib/commands/serve');
const watch = require('../lib/commands/watch');
const build = require('../lib/commands/build');
const deploy = require('../lib/commands/deploy');
const newProject = require('../lib/commands/new');
const test = require('../lib/commands/test');
const add = require('../lib/commands/add');
const helpers = require('../lib/commands/helpers');

const mainPrompt = Vorpal();

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
const settingsPath = path.join(process.cwd(), 'config/settings.js');
if (!fileExists(settingsPath)) {
  console.error('Add a "./config/settings.js" file.');
  return;
}
state.settings = loadSettings(settingsPath);

// Get active env.
state.activeEnv = process.argv[2] || state.settings.localEnvironment;
console.log(chalk.yellow(`Active environment: "${state.activeEnv}".`));

// Load apps config.
const configPath = path.join(process.cwd(), 'config/apps.js');
if (!fileExists(configPath)) {
  console.error('Add a "./config/apps.js" file.');
  return;
}
state.apps = loadAppsConfig(configPath, state.env);

// Load env.
const envPath = path.join(process.cwd(), 'config/env.js');
state.env = loadEnv(envPath, state.apps);

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

// Utility functions.
function logArray(obj, error = false) {
  if (error) {
    console.error(obj.map(item => chalk.red('-> ' + item)).join(EOL));
  }
  else {
    console.log(obj.map(item => '-> ' + item).join(EOL));
  }
};


// Register commands w/ vorpal.
mainPrompt
  .command('status [command]')
  .autocomplete(status.autocompleteOptions().map(item => chalk.magenta(item)))
  .help(async (args) => {
    var str = '';
    str = mainPrompt._commandHelp('status');
    str += `${EOL}  Command List:${EOL}`;
    str += status.autocompleteOptions(false).map(item => `   - ${item}`).join(EOL);
    str += EOL;
    console.log(str);
    return mainPrompt.show(); // @note idk if there's a way to modify help w/o this return.
  })
  .action(async args => {
    var {errors, info} = await status.main(state)(args);
    if (info) logArray(info);
    if (errors) logArray(errors, true);
    return errors;
  });

mainPrompt
  .command('build')
  .option('-v, --verbose', '[optional]')
  .action(async args => {
    args.options = {
      verbose: false,
      ...args.options,
    };
    const startTime = Date.now();
    var {info, errors} = await status.main(state)(args);
    if (errors) {
      console.log('Status errors:');
      logArray(errors, true);
    }
    else {
      var {info, errors} = await build.main(state)(args);
      if (info) logArray(info);
      if (errors) logArray(errors, true);
      console.log(`-> Build time (${Date.now() - startTime}ms)`);
    }
    return errors;
  });

mainPrompt
  .command('deploy')
  .action(async args => {
    var {info, errors} = await build.main(state)(args);
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

mainPrompt
  .command('serve')
  .action(async args => {
    var {info, errors} = await build.main(state)(args);
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

mainPrompt
  .command('helpers')
  .action(async args => {
    var {info, errors} = await helpers.main(state)(args);
    if (errors) {
      console.log('Helpers errors:');
      logArray(errors, true);
    }
    return errors;
  });

// mainPrompt
//   .command('watch')
//   .action();

// mainPrompt
//   .command('new')
//   .action(new);
//
// mainPrompt
//   .command('test')
//   .action(test);

//   // vorpal
//   .command('add')
//   .action(add);

// Display vorpal in terminal.
mainPrompt
  .delimiter(state.settings.delimiter)
  .show()
  .exec('help');
