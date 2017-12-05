const path = require('path');

const defaults = {
  delimiter: '$brahma',
  serverLogBufferInterval: 3000,
  bufferServerLogs: false,
  localEnvironment: 'development',
  nodeVersion: '9.2.0',
};

module.exports = (settingsPath) => {
  delete require.cache[path.resolve(settingsPath)]; // Clear require cache.
  var obj = require(settingsPath) || {};
  return {
    ...defaults,
    ...obj,
  };
};
