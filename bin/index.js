#!/usr/bin/env node

const vorpal = require('vorpal')();
const path = require('path');
const {fileExists, runBefore, log} = require('../lib/utils');
const chalk = require('chalk');

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
var config = loadAppsConfig(configPath, activeEnv);

// Load env.
const envPath = path.join(process.cwd(), 'brahma.env.js');
var env = loadEnv(envPath, config);

// Load variables.
const variablesPath = path.join(process.cwd(), 'brahma.config.js');
var variables = loadVariables(variablesPath);

// Proxy `config`, `settings`, and `env`, for live data over time.
config = new Proxy(config, {
  get: (t, name) => loadAppsConfig(configPath, activeEnv)[name],
});

settings = new Proxy(settings, {
  get: (t, name) => loadSettings(settingsPath)[name],
});

env = new Proxy(env, {
  get: (t, name) => loadEnv(envPath, config)[name],
});

variables = new Proxy(variables, {
  get: (t, name) => loadVariables(variablesPath),
});


// Register commands w/ vorpal.
const data = {config, settings, env, variables};
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
