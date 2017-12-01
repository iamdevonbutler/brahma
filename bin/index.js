#!/usr/bin/env node

const vorpal = require('vorpal')();
const path = require('path');
const {fileExists, runBefore, log} = require('../lib/utils');

const loadConfig = require('../lib/utils/loadConfig');
const loadSettings = require('../lib/utils/loadSettings');
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
  console.error('Add a "./brahma.config.js" file.');
  return;
}
var settings = loadSettings(settingsPath);

// Load config.
const configPath = path.join(process.cwd(), 'brahma.config.js');
if (!fileExists(configPath)) {
  console.error('Add a "./brahma.config.js" file.');
  return;
}
var config = loadConfig(configPath);
if (!config) {
  console.error('Add "apps" to your "brahma.config.js" file.');
  return;
}

// Load env.
const envPath = path.join(process.cwd(), 'brahma.env.js');
var env = loadEnv(envPath);

// Proxy `config`, `settings`, and `env`, for live data over time.
config = new Proxy(config, {
  get: (t, name) => loadConfig(configPath)[name],
});

settings = new Proxy(settings, {
  get: (t, name) => loadSettings(settingsPath)[name],
});

env = new Proxy(env, {
  get: (t, name) => loadEnv(envPath)[name],
});


// Register commands w/ vorpal.
vorpal
  .command('status')
  .option('-e, --environment <environment>', 'NODE_ENV=[development|production|test|...]')
  .action(status({config, settings, env}));

vorpal
  .command('build')
  .option('-e, --environment <environment>', 'NODE_ENV=[development|...] (development)')
  .action(async args => {
    var valid = await status({config, settings, env})(args);
    if (valid) {
      return await build({config, settings, env})(args);
    }
  });

vorpal
  .command('deploy')
  .action(async args => {
    var valid = await build({config, settings, env})(args);
    if (valid) {
      return deploy({config, settings, env})(args);
    }
  });

vorpal
  .command('serve')
  .action(async args => {
    var valid = await build({config, settings, env})(args);
    if (valid) {
      return await serve({config, settings, env})(args);
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
