const defaults = {
  delimiter: '$brahma',
  serverLogsBufferInterval: 3000,
  bufferServerLogs: false,
};

module.exports = settingsPath => {
  return {
    ...defaults,
    ...require(settingsPath),
  };
};
