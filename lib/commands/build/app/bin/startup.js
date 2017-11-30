#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const throng = require('throng');

const {APP_NAME, PORT, WEB_CONCURRENCY} = process.env;
const CONCURRENCY = WEB_CONCURRENCY || 1;

process.env.LIFECYCLE = 'startup';

// if (!APP_NAME) throw 'Configure "app/.env" to include an APP_NAME property.';
// if (!PORT) throw 'Configure "app/.env" to include a PORT property.';

const loadConfig = require('../lib/bootstrap/loadConfig');
const server = require('../lib/server');

const config = loadConfig('../brahma.app.js');

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
