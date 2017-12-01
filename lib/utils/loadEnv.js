const path = require('path');

module.exports = (envPath, key, appName) => {
  delete require.cache[path.resolve(envPath)]; // Clear require cache.
  var obj = require(envPath)[key] || {};
  return {
    APP_NAME: appName,
    ...obj,
  };
};
