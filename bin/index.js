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
var settings = loadSettings(settingsPath);

// Get active env.
const activeEnv = process.argv[2] || settings.localEnvironment;
console.log(chalk.yellow(`Active environment: "${activeEnv}".`));

// Load config.
const configPath = path.join(process.cwd(), 'brahma.apps.js');
if (!fileExists(configPath)) {
  console.error('Add a "./brahma.apps.js" file.');
  return;
}
var config = loadAppsConfig(configPath, env);

// Load env.
const envPath = path.join(process.cwd(), 'brahma.env.js');
var env = loadEnv(envPath, config);

// Load variables.
const variablesPath = path.join(process.cwd(), 'brahma.config.js');
var variables = loadVariables(variablesPath, env);

// Make `config`, `settings`, and `env`, `variables` update live during runtime.
const state = {
  config: {updated: false, value: config},
  varaibles: {updated: false, value: variables},
  env: {updated: false, value: env},
  settings: {updated: false, value: settings},
};

function changed(name) {
  return () => {
    state[name].updated = true;
  };
};

chokidar
  .watch(path.join(process.cwd(), 'brahma.apps.js'))
  .on('change', changed('config'));

chokidar
  .watch(path.join(process.cwd(), 'brahma.env.js'))
  .on('change', changed('env'));

chokidar
  .watch(path.join(process.cwd(), 'brahma.settings.js'))
  .on('change', changed('settings'));

chokidar
  .watch(path.join(process.cwd(), 'brahma.config.js'))
  .on('change', changed('variables'));

config = new Proxy(config, {
  get: (target, name) => {
    if (state.config.updated) {
      state.config.updated = false;
      state.config.value = loadAppsConfig(configPath, env);
    }
    return name ? state.config.value[name] : state.config.value;
  },
});

settings = new Proxy(settings, {
  get: (target, name) => {
    if (state.settings.updated) {
      state.settings.updated = false;
      state.settings.value = loadSettings(settingsPath);
    }
    return name ? state.settings.value[name] : state.settings.value;
  },
});

env = new Proxy(env, {
  get: (target, name) => {
    if (state.env.updated) {
      state.env.updated = false;
      state.env.value = loadEnv(envPath, config);
    }
    return name ? state.env.value[name] : state.env.value;
  },
});

variables = new Proxy(variables, {
  get: (target, name) => {
    if (state.variables.updated) {
      state.variables.updated = false;
      state.variables.value = loadVariables(variablesPath, env);
    }
    return name ? state.variables.value[name] : state.variables.value;
  },
});


// Register commands w/ vorpal.
const data = {config, settings, env, activeEnv, variables};
vorpal
  .command('status')
  .action(async args => {
    return await status(data)(args);
  });

vorpal
  .command('build')
  .action(async args => {
    var valid = await status(data)(args);
    if (valid) {
      return await build(data)(args);
    }
  });

vorpal
  .command('deploy')
  .action(async args => {
    var valid = await build(data)(args);
    if (valid) {
      return deploy(data)(args);
    }
  });

vorpal
  .command('serve')
  .action(async args => {
    var valid = await build(data)(args);
    if (valid) {
      return await serve(data)(args);
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
  .delimiter(settings.delimiter)
  .show()
  .exec('help');
