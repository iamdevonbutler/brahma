{% if https %}const https = require('https');{% endif %}
{% if http %}const http = require('http');{% endif %}
const {EOL} = require('os');
const {readFileSync} = require('fs');
const Koa = require('koa');
const mongodb = require('mongodb');
const mongorules = require('mongorules');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const devLogger = require('koa-logger');
const responseTime = require('koa-response-time');
const cors = require('koa2-cors');
const basicAuth = require('koa-basic-auth');
const lcache = require('lru-cache');
const mcache = require('memory-cache');
const koaStatic = require('koa-static');

const loadRoutes = require('./bootstrap/loadRoutes');
const loadMongorules = require('./bootstrap/loadMongorules');
const loadRabbit = require('./bootstrap/loadRabbit');
const decorateResources = require('./bootstrap/lib/decorateResources');
const callResourceDecorators = require('./bootstrap/lib/callResourceDecorators');
const callGlobalResourceDecorators = require('./bootstrap/lib/callGlobalResourceDecorators');
const callResourceCallback = require('./bootstrap/lib/callResourceCallback');
const normalizeResources = require('./bootstrap/lib/normalizeResources');

const {unhandledRejectionHandler} = require('./callbacks');
const {forceHTTPS, errorHandler, ratelimiter, lockdown} = require('./middleware');

const {logger, logdna, mailgun, $mailgun} = require('./services');

const {fileExists, objValuesToBoolean, getObjFromDirectory, callOnce} = require('./utils');
const {connectToRedis, closeConnections} = require('./connections');

const {NODE_ENV, APP_NAME, PORT, WEB_CONCURRENCY} = process.env;
const isProd = NODE_ENV === 'production';

module.exports = (config) => async () => {
  var app, server, router, resources, $resources, injectables = {}, messages = [];

  const resourcesPath = path.join(process.cwd(), '/resources');
  const configPath = path.join(process.cwd(), '/config/index.js');
  const utilsPath = path.join(process.cwd(), '/utils/index.js');

  // Log manifest.
  var obj = objValuesToBoolean(config);
  logger.info(obj, 'app.startup.request');

  // Safe shutdown.
  const shutdownApp = callOnce(shutdown);

  // Graceful exit.
  process.on('SIGTERM', () => {
    logger.info('app.SIGTERM.request');
    shutdownApp();
  });

  process.on('SIGINT', () => {
    logger.info('app.SIGINT.request');
    shutdownApp();
  });

  // Handle promise rejections.
  process.on('unhandledRejection', unhandledRejectionHandler(APP_NAME, isProd));

  // Add injectables.
  injectables = {...config.injectables};
  injectables.logger = logger;
  injectables.mailgun = mailgun;
  injectables.$mailgun = $mailgun;
  injectables.shutdownApp = shutdownApp;
  if (fileExists(configPath)) {
    injectables.config = require(configPath);
  }
  if (fileExists(utilsPath)) {
    injectables.utils = require(utilsPath);
  }
  if (config.lcache) {
    injectables.lcache = lcache;
  }
  if (config.mcache) {
    injectables.mcache = mcache;
  }

  // Init redis.
  if (config.redis) {
    const {REDIS_PORT, REDIS_HOST, REDIS_PASS} = process.env;
    let options = {
      prefix: 'cache',
      host: REDIS_HOST,
      port: REDIS_PORT,
    };
    if (REDIS_PASS) options.password = REDIS_PASS;
    injectables.redis = await connectToRedis({
      name: 'cache',
      shutdownApp,
      options,
    });
    messages.push('-> Using redis (set REDIS_PORT, REDIS_HOST, REDIS_PASS - has local defaults)');
  }

  // Init rabbit.
  if (config.rabbit) {
    injectables.rabbit = await loadRabbit({shutdownApp});
    messages.push('-> Using rabbit (set RABBIT_URL - has local defaults)');
  }

  // Init mongorules.
  if (config.mongorules) {
    await loadMongorules({resourcesPath, config: config.mongorules, shutdownApp});
    const {defaultConnectionName, defaultDatabaseName} = config.mongorules;
    const db = mongorules.getDatabase(defaultConnectionName, defaultDatabaseName);
    injectables.mongorules = mongorules;
    injectables.db = db;
    messages.push('-> Using mongorules (set MONGODB_URL - has local defaults)');
  }

  // Init resources.
  resources = normalizeResources(getObjFromDirectory(resourcesPath));
  resources = callGlobalResourceDecorators(resources, injectables, config.decorators);
  resources = callResourceDecorators(resources, injectables);
  $resources = decorateResources({resources, injectables});

  // Load koa & dependencies.
  if (config.http || config.https) {
    app = new Koa();
    router = loadRoutes({$resources, injectables});
  }

  // Signed cookies.
  if (config.signedCookies) {
    app.keys = config.signedCookies.keys;
    messages.push('-> Using signed cookies');
  }

  // Last try/catch.
  if (config.http || config.https) {
    app.use(errorHandler(APP_NAME));
  }

  // Force SSL.
  if (isProd && config.https) {
    app.use(forceHTTPS());
    messages.push('-> Using forceHTTPS');
  }

  // Lockdown.
  if (config.lockdown) {
    app.use(lockdown(config.lockdown));
    messages.push('-> Using lockdown');
  }

  // Response time.
  if (config.http || config.https) {
    app.use(responseTime());
    messages.push('-> Using responseTime');
  }

  // Dev logger.
  if (!isProd && (config.http || config.https)) {
    app.use(devLogger());
    messages.push('-> Using logger (dev only)');
  }

  // Custom ratelimiter.
  if (config.ratelimiter) {
    const {limit, duration} = config.ratelimiter;
    const {RATELIMITER_PORT, RATELIMITER_HOST, RATELIMITER_PASS} = process.env;
    // Would set "prefix" but ratelimiter module uses the "limit" by default.
    let options = {
      host: RATELIMITER_HOST,
      port: RATELIMITER_PORT,
    };
    if (RATELIMITER_PASS) options.password = RATELIMITER_PASS;
    const redisClient = await connectToRedis({
      name: 'ratelimiter',
      shutdownApp,
      options,
    });
    app.use(ratelimiter({resources, redisClient, router, limit, duration, appName: APP_NAME}));
    messages.push('-> Using ratelimiter (set RATELIMITER_PORT, RATELIMITER_HOST, RATELIMITER_PASS - has local defaults)');
  }

  // CORS.
  if (config.cors) {
    const {whitelist} = config.cors;
    app.use(cors({
      origin(ctx) {
        const origin = ctx.get('Origin');
        const isWhitelisted = origin && whitelist.indexOf(origin) > -1;
        return isWhitelisted ? origin : '';
      },
      ...config.cors.options,
    }));
    messages.push('-> Using cors');
  }

  // Basic auth.
  if (config.basicAuth) {
    app.use(basicAuth(config.basicAuth));
    messages.push('-> Using basicAuth');
  }

  // Serve static files.
  if (config.static) {
    app.use(koaStatic(config.static.root, config.static.options));
    messages.push('-> Using static');
  }

  // Body parser.
  if (config.http || config.https) {
    app.use(bodyParser());
    messages.push('-> Using bodyParser');
  }

  // Koa router.
  if (config.http || config.https) {
    app.use(router.routes());
    app.use(router.allowedMethods());
    messages.push('-> Using router');
  }

  // Log injectables.
  messages.push(`-> Injecting: ${Object.keys(injectables).join(', ')}`);

  // Log web concurrency.
  messages.push(`-> Web concurrency: "${WEB_CONCURRENCY || 1}"`);

  // Listen on port X, log manifest, and init resources.
  if (config.https && NODE_ENV === 'development') {
    const key = readFileSync(path.join(__dirname, '/config/cert/key.pem'));
    const cert = readFileSync(path.join(__dirname, '/config/cert/cert.pem'));
    server = https.createServer({key, cert}, app.callback()).listen(PORT, async () => {
      const port = server.address().port;
      logger.info({port, https: true}, 'app.startup.listen');
      messages.push(`-> HTTPS server listening on port "${port}"`);
      messages.push(`-> Calling resource.init() callbacks.`);
      await callResourceCallback($resources, 'init');
      await callAppInitCallback($resources);
      console.log(messages.join(EOL));
    });
  }
  else if (config.http || (config.https && isProd)) {
    server = http.createServer(app.callback()).listen(PORT, async () => {
      const port = server.address().port;
      logger.info({port, http: true}, 'app.startup.listen');
      messages.push(`-> HTTP server listening on port "${port}"`);
      messages.push(`-> Calling resource init() callbacks.`);
      await callResourceCallback($resources, 'init');
      await callAppInitCallback($resources);
      console.log(messages.join(EOL));
    });
  }
  else {
    messages.push(`-> Calling resource init() callbacks.`);
    await callResourceCallback($resources, 'init');
    await callAppInitCallback($resources);
    console.log(messages.join(EOL));
  }

  async function callAppInitCallback($resources) {
    // Call app init script.
    const initCallbackPath = path.join(process.cwd(), '/app/init.js');
    const initCallback = fileExists(initCallbackPath) ? require(initCallbackPath) : null;
    if (initCallback) {
      messages.push(`-> Calling app.init() callback.`);
      await initCallback.call(null, {app, server, router, ...injectables, $resources});
    }
  };

  async function shutdown(err) {
    var messages = [];

    function closeServer() {
      return new Promise((resolve, reject) => server.close(resolve));
    };

    // Log and email (if prod) shutdown request.
    if (err) {
      logger.error('app.shutdown.request');
      if (isProd) {
        await $mailgun.send({
          to: 'jay@hashcore.io',
          subject: `${APP_NAME} shutdown (not graceful)`,
          html: '<a href="https://app.logdna.com/6bd2ffb4c3/logs/view">logdna</a>',
        });
      }
    }
    else {
      logger.info('app.shutdown.request');
    }

    // Shutdown server (if running).
    if (server) {
      messages.push('-> Closing server');
      await closeServer();
    }

    // Call resource shutdown methods.
    await callResourceCallback($resources, 'shutdown');
    messages.push('-> Calling resource shutdown callbacks');

    // Call app shutdown.js.
    const code = err ? 1 : 0;
    const shutdownCallbackPath = path.join(process.cwd(), '/app/shutdown.js');
    const shutdownCallback = fileExists(shutdownCallbackPath) ? require(shutdownCallbackPath) : null;
    if (shutdownCallback) {
      messages.push('-> Calling app.shutdown() callback');
      await shutdownCallback.call(null, {app, server, router, ...injectables});
    }

    // Close connections (to mongodb and redis and bee).
    messages.push('-> Closing connections');
    await closeConnections();

    // Send buffered logs to logdna.
    logdna.logger._flush();

    // Log messages.
    messages.push('-> Exiting app');
    console.log(messages.join(EOL));

    // Clear callback stack before killing process.
    setTimeout(() => process.exit(code), 0);
  }

};
