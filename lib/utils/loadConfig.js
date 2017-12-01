const path = require('path');
const {isType} = require('../utils');
const objectAssignDeep = require('object-assign-deep');

const defaults = {
  http: false,
  https: false,
  redis: false,
  lcache: false,
  mcache: false,
  static: false,
  lockdown: false,
  ratelimiter: false,
  signedCookies: false,
  cors: false,
  injectables: null,
  integrations: null,
  basicAuth: false,
  decorators: null,
  inactive: false,
};

const moduleDefaults = {
  lockdown: {
    header: 'host',
  },
  static: {
    root: path.join(process.cwd(), 'static'),
    options: {},
  },
  cors: {
    options: {
      credentials: true,
    }
  },
};

module.exports = (configPath, env) => {
  var keys, obj, config = {};

  delete require.cache[path.resolve(configPath)]; // Clear require cache.
  obj = require(configPath);
  if (!obj || !isType(obj, 'function')) throw `Your brahma.config.js file should format as a Function that returns an Object.`;
  obj = obj(env);
  if (!obj) throw `Your brahma.config.js file should return an Object.`;

  // Set config defaults.
  keys = Object.keys(obj);
  keys.forEach(appName => {
    var keys;
    config[appName] = {
      ...defaults,
      ...obj[appName],
    };
    keys = Object.keys(config[appName]);
    keys.forEach(key => {
      const item = config[appName][key];
      if (item && moduleDefaults[key]) {
        config[appName][key] = objectAssignDeep({}, moduleDefaults[key], isType(item, 'object') ? item : {});
      }
    });
  });

  return config;
};