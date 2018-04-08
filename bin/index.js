#!/usr/bin/env node

const path = require('path');
const initTerminal = require('../lib/cli');

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
