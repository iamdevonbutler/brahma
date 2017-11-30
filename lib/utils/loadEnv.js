module.exports = (src, key) => {
  var obj = require(src)[key] || {};
  return {
    APP_NAME: appName,
    ...obj,
  };
};
