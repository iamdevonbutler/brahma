const path = require('path');
const {isType} = require('../utils');

const setFieldDefaults = (value) => {
  if (isType(value, 'object')) {
    return {
      overwrite: true,
      refresh: true,
      ...value,
    };
  }
  else {
    return {
      overwrite: true,
      refresh: true,
      value,
    };
  }
};

module.exports = (envPath, config) => {
  var obj, keys, env = {};

  delete require.cache[path.resolve(envPath)]; // Clear require cache.
  obj = require(envPath);
  if (!obj || !isType(obj, 'function')) throw `Your brahma.env.js file should format as a Function that returns an Object.`;
  obj = obj(config);
  if (!obj) throw `Your brahma.env.js file should return an Object.`;

  keys = Object.keys(obj);
  keys.forEach(appName => {
    var keys1 = Object.keys(obj[appName]);
    env[appName] = {};
    keys1.forEach(envName => {
      var fields = Object.keys(obj[appName][envName]).reduce((p, c) => {
        p[c] = setFieldDefaults(obj[appName][envName][c]);
        return p;
      }, {});
      env[appName][envName] = {
        APP_NAME: setFieldDefaults(appName),
        NODE_ENV: setFieldDefaults(envName),
        ...fields,
      };
    });
  });
  return env;
};
