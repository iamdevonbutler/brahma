#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const throng = require('throng');
const {NODE_ENV, WEB_CONCURRENCY} = process.env;
const CONCURRENCY = WEB_CONCURRENCY || 1;

// Load config.
const {loadConfig} = require('../lib/config');
loadConfig(path.join(process.cwd(), 'config'));

const {APP_NAME, PORT} = process.env;
if (!APP_NAME) throw 'Configure "app/.env" to include an APP_NAME property.';//@todo
if (!PORT) throw 'Configure "app/.env" to include a PORT property.';//@todo

const configPath = path.join(process.cwd(), '/app/app.js');
const config = require(configPath);
const setDefaults = require('../lib/defaults');
const validate = require('../lib/validate');

const server = require('../lib/server');
const start = server(validate(setDefaults(config)));

if (CONCURRENCY === 1) {
  start();
}
else {
  throng({
    workers: CONCURRENCY,
    lifetime: Infinity
  }, start);
}
