#!/usr/bin/env node

const vorpal = require('vorpal')();
const path = require('path');
const {fileExists, runBefore, log} = require('../lib/utils');
const loadConfig = require('../lib/bootstrap/loadConfig');
const loadSettings = require('../lib/bootstrap/loadSettings');

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
  console.log('Brahma requires node version >= 9.0.0');
  return;
}

// Load Settings.
const settingsPath = path.join(process.cwd(), 'brahma.settings.js');
if (!fileExists(settingsPath)) {
  console.log('Add a "./brahma.config.js" file.');
  return;
}
const settings = loadSettings(settingsPath);

// Load config.
const configPath = path.join(process.cwd(), 'brahma.config.js');
if (!fileExists(configPath)) {
  console.log('Add a "./brahma.config.js" file.');
  return;
}
const config = loadConfig(configPath);
if (!config) {
  console.log('Add "apps" to your "brahma.config.js" file.');
  return;
}

// Register commands w/ vorpal.
const before = runBefore(vorpal);
const buildAndLog = log(build({config, settings}), 'Build');
const deployAndLog = log(deploy({config, settings}), 'Deploy');

vorpal
  .command('status')
  .action(status);

vorpal
  .command('serve')
  .action(before('build', serve({config, settings})));

// @todo maybe its always in watch mode? - call watch on boot
vorpal
  .command('watch')
  .action(before('serve', watch));

vorpal
  .command('build')
  .option('-e, --environment <environment>', 'NODE_ENV=[development|production|test]')
  .action(before('status', buildAndLog));

vorpal
  .command('deploy')
  .action(before('build', 'test', deployAndLog));

vorpal
  .command('scafold')
  .action(scafold);

vorpal
  .command('test')
  .action(test);

// Display vorpal in terminal.
vorpal
  .delimiter(settings.delimiter)
  .show()
  .exec('help');
