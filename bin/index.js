#!/usr/bin/env node

const path = require('path'); 
const initTerminal = require('../lib/cli');
const loadConfig = require('../lib/load/loadConfig');

state = {};

// Error handling.
process.on('unhandledRejection', console.error);

// Node version check.
const majorVersion = +process.version.slice(1).split('.')[0];
if (majorVersion < 9) {
  logError('Brahma requires node version >= 9.0.0');
  return;
}

// Init terminal.
const commandsPath = path.resolve(__dirname, '../lib/commands');
const cachePath = path.resolve(__dirname, '../cache/cli-history.js');
initTerminal(commandsPath, cachePath);

// Load config.
// live update `state` during runtime.
const configRoot = path.join(process.cwd(), 'config');
state.config = loadConfig('/Users/jay/dev/brahma/brahma-example-advanced/config', 'status.js');
console.log(state.config);
return;
configs.forEach((state) => {
  state.config.forEach(configName => {
    chokidar
    .watch(path.join(process.cwd(), `config/${configName}.js`))
    .on('change', () => {
      state.config[configName] = loadConfig(configRoot, configName);
    });
  });
});
