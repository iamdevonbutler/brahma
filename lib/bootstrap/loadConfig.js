const path = require('path');
const {isType} = require('./utils');
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

module.exports = (configPath) => {
  var keys, obj, config = {};

  // Load and filter config.
  obj = require(objPath);
  obj = {
    common: obj.common || null,
    apps: obj.apps || null,
  };

  // Set config defaults.
  keys = Object.keys(obj.apps);
  keys.forEach(appName => {
    var keys;
    config[appName] = {
      ...defaults,
      ...obj.common,
      ...obj.apps[appName],
    };
    keys = Object.keys(config[appName]);
    keys.forEach(key => {
      const item = config[appName][key];
      if (item && moduleDefaults[key]) {
        config[appName][key] = objectAssignDeep({}, moduleDefaults[key], isType(item, 'object') ? item : {});
      }
    });
  });

  // Validate config.
  keys = Object.keys(config);
  keys.forEach(appName => {
    const {lockdown, decorators, mongorules, cors, signedCookies, basicAuth} = config[appName];
    if (lockdown) {
      if (!lockdown.whitelist) throw `"apps.${appName}.lockdown" needs a "whitelist" property (brahma.config.js).`;
      if (!isType(lockdown.whitelist, 'array')) throw `"apps.${appName}.lockdown.whitelist" needs an "Array" (brahma.config.js).`;
    }
    if (decorators) {
      if (!isType(decorators, 'array')) throw `"apps.${appName}.decorators" needs an "Array" (brahma.config.js).`;
    }
    if (mongorules) {
      const {defaultConnectionName, defaultDatabaseName} = mongorules;
      if (!defaultConnectionName) throw `"apps.${appName}.mongorules" needs a "defaultConnectionName" property (brahma.config.js).`;
      if (!defaultDatabaseName) throw `"apps.${appName}.mongorules" needs a "defaultDatabaseName" property (brahma.config.js).`;
    }
    if (cors) {
      const {whitelist} = cors;
      if (!whitelist || !whitelist.length) throw `"apps.${appName}.cors" needs a "whitelist" property w/ at least one item (brahma.config.js).`;
    }
    if (signedCookies) {
      const {keys} = signedCookies;
      if (!keys) throw `"apps.${appName}.signedCookies" needs a "keys" property (brahma.config.js).`;
    }
    if (basicAuth) {
      const {name, password} = basicAuth;
      if (!name || !password) throw `"apps.${appName}.basicAuth" needs a "name" and "password" property (brahma.config.js).`;
    }
  });
  // Return config.
  return config;
};
