#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const throng = require('throng');

const {APP_NAME, PORT, CONCURRENCY = 1} = process.env;

process.title = APP_NAME;
process.env.LIFECYCLE = 'startup';

const config = require('../app.js');
const server = require('../lib/server');

const start = server(config);

if (CONCURRENCY === 1) {
  start();
}
else {
  throng({
    workers: CONCURRENCY,
    lifetime: Infinity
  }, start);
}
