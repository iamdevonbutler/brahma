module.exports = (src, key, appName) => {
  var obj = require(src)[key] || {};
  return {
    APP_NAME: appName,
    ...obj,
  };
};
