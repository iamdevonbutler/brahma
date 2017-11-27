const throng = require('throng');
const CONCURRENCY = WEB_CONCURRENCY || 1;

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
