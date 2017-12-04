const validateAppsConfig = require('../../utils/validateAppsConfig');
const path = require('path');


module.exports = ({apps, settings, env, variables}) => async (args) => {
  var info = [], errors = [];

  const apps1 = Object.keys(apps) || null;
  if (!apps1.length) {
    errors.push(`No apps (brahma.apps.js)`);
    return {
      info: null,
      errors,
    };
  };

  // Log all apps.
  info.push(`Apps: ${apps1.map(item => `"${item}"`).join(', ')}`);

  // brahma.apps.js.
  // General validation.
  var errors1 = apps1.reduce((p, c) => {
    return p.concat(validateAppsConfig(apps[c], c));
  }, []).filter(Boolean);
  errors = errors.concat(errors1);

  // brahma.env.js.
  // Make sure each property has a value property.
  apps1.forEach(appName => {
    if (!env[appName]) return;
    // Validate each field.
    let keys = Object.keys(env[appName]);
    keys.forEach(envName => {
      var keys1 = Object.keys(env[appName][envName]);
      keys1.forEach(fieldName => {
        var field = env[appName][envName][fieldName];
        if (field.value === undefined) {
          let error = `Missing property "value" (env.${appName}.${envName}.${fieldName}.value)`;
          errors.push(error);
        }
      });
    });
  });

  // @todo
  // resources
  // ...

  return {
    info: info.length ? info : null,
    errors: errors.length ? errors : null,
  };
};
