const defaults = {
  delimiter: '$brahma',
  serverLogBufferInterval: 3000,
  bufferServerLogs: false,
};

module.exports = settingsPath => {
  return {
    ...defaults,
    ...require(settingsPath),
  };
};
