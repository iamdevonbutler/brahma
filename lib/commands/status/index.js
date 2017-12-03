const validateAppsConfig = require('../../utils/validateAppsConfig');
const path = require('path');
const chalk = require('chalk');

var messages = [], valid = true;

const good = (input) => messages.push(chalk.green(input));
const bad = (input) => {
  valid = false;
  messages.push(chalk.red(input));
};
const ok = (input) => messages.push(input);

module.exports = ({config, settings, env, variables}) => async (args) => {
  const apps = Object.keys(config) || null;
  if (!apps.length) {
    console.error('No apps (brahma.apps.js)');
    return;
  };

  // Log all apps.
  ok(`Apps: ${apps.map(item => `"${item}"`).join(', ')}`);

  // brahma.apps.js.
  // General validation.
  var errors = apps.reduce((p, c) => {
    return p.concat(validateAppsConfig(config[c], c));
  }, []).filter(Boolean);
  if (errors.length) {
    bad(errors.join('\n'));
  }
  else {
    good('OK (brahma.apps.js)');
  }

  // brahma.env.js.
  // Make sure each property has a value property.
  apps.forEach(appName => {
    if (!env[appName]) {
      bad(`Missing config for app "${appName}" (brahma.env.js)`);
      return;
    }
    // Validate each field.
    let keys = Object.keys(env[appName]);
    keys.forEach(envName => {
      var keys1 = Object.keys(env[appName][envName]);
      keys1.forEach(fieldName => {
        var field = env[appName][envName][fieldName];
        if (field.value === undefined) {
          bad(`Missing property "value" (env.${appName}.${envName}.${fieldName}.value)`);
        }
      });
    });
  });

  // @todo
  // resources
  // ...

  // @todo i dont think i need to do much here.
  // brahma.config.js
  // brahma.settings.js


  // Print messages.
  console.log(messages.join('\n'));

  // Clear messages for next run.
  messages.length = 0;

  return valid;
};
