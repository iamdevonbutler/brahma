#!/usr/bin/env node --harmony

const vorpal = require('vorpal')();
const path = require('path');
const {fileExists} = require('../lib/utils');
const normalizeConfig = require('../lib/normalizeConfig');

const status = require('../lib/commands/status');
const watch = require('../lib/commands/watch');
const build = require('../lib/commands/build');
const deploy = require('../lib/commands/deploy');

// Load config.
const configPath = path.join(process.cwd(), 'mamba.config.js');
if (!fileExists(configPath)) {
  console.log('Add a "./mamba.config.js" file.');
  return;
}
const config = normalizeConfig(require(configPath));

// Init vorpal.
vorpal
  .command('status')
  .action(status);

vorpal
  .command('watch')
  .action(watch);

vorpal
  .command('build')
  .action(build);

vorpal
  .command('deploy')
  .action(deploy);

vorpal
  .delimiter(config.delimiter)
  .show();
