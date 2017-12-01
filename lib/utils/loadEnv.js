const path = require('path');
const {isType} = require('../utils');

module.exports = (envPath, activeEnv, config) => {
  var obj, keys;

  delete require.cache[path.resolve(envPath)]; // Clear require cache.
  obj = require(envPath);
  if (!obj || !isType(obj, 'function')) throw `Your brahma.env.js file should format as a Function that returns an Object.`;
  obj = obj(config);
  if (!obj) throw `Your brahma.env.js file should return an Object.`;

  keys = Object.keys(obj);
  keys.forEach(appName => {
    obj[appName] = {
      APP_NAME: appName,
      ...obj[appName][activeEnv],
    };
  });

  return obj;
};
