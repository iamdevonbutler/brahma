const {forEach} = require('../../../utils');

const self = module.exports;

// brahma.env.js.
// Make sure each property has a value property.
self.main = async ({apps, env}) => {
  var errors = [], apps1;
  apps1 = apps ? Object.keys(apps) : [];
  apps1.forEach(appName => {
    if (!env || !env[appName]) return;
    forEach(env[appName], (appEnv, envName) => {
      forEach(appEnv, (property, propertyName) => {
        if (property.value === undefined) {
          let error = `Missing property "value" (env.${appName}.${envName}.${propertyName}.value)`;
          errors.push(error);
        }
      });
    });
  });
  return {
    info: null,
    errors: errors.length ? errors : null,
  }
};
