const path = require('path');

const defaults = {
  delimiter: '$brahma',
  serverLogBufferInterval: 3000,
  bufferServerLogs: false,
  localEnvironment: 'development',
};

module.exports = (settingsPath) => {
  delete require.cache[path.resolve(settingsPath)]; // Clear require cache.
  var obj = require(settingsPath) || {};
  return {
    ...defaults,
    ...obj,
  };
};
