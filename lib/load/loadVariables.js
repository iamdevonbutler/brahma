const path = require('path');
const {isType} = require('../utils');

module.exports = (variablesPath, env) => {
  var obj, keys;

  delete require.cache[path.resolve(variablesPath)]; // Clear require cache.
  obj = require(variablesPath);
  if (!obj || !isType(obj, 'function')) throw `Your brahma.config.js file should format as a Function that returns an Object.`;
  obj = obj(env);
  if (!obj) throw `Your brahma.config.js file should return an Object.`;
  return Object.keys(obj).length ? obj : null;
};
