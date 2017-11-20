#!/usr/bin/env node

const vorpal = require('vorpal')();
const path = require('path');
const {fileExists, runBefore, log} = require('../lib/utils');
const normalizeConfig = require('../lib/normalizeConfig');

const status = require('../lib/commands/status');
const serve = require('../lib/commands/serve');
const watch = require('../lib/commands/watch');
const build = require('../lib/commands/build');
const deploy = require('../lib/commands/deploy');
const scafold = require('../lib/commands/scafold');

// Load config.
const configPath = path.join(process.cwd(), 'brahma.config.js');
if (!fileExists(configPath)) {
  console.log('Add a "./brahma.config.js" file.');
  return;
}
const config = normalizeConfig(require(configPath));

process.title = 'brahma';
const before = runBefore(vorpal);

// Init vorpal.
vorpal
  .command('status')
  .action(status);

vorpal
  .command('serve')
  .action(before('build', serve));

vorpal
  .command('watch')
  .action(before('serve', watch));

vorpal
  .command('build')
  .action(before('status', log(build, 'Build')));

vorpal
  .command('deploy')
  .action(before('build', log(deploy, 'Deploy')));

vorpal
  .command('scafold')
  .action(scafold);

// @todo runs tests
// vorpal
//   .command('test')
//   .action(scafold);

vorpal
  .delimiter(config.delimiter)
  .show()
  .exec('help');
