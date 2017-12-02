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
  // Log all apps.
  const apps = Object.keys(config) || null;
  if (!apps.length) return console.log('No apps (brahma.apps.js)');
  ok(`Apps: ${apps.map(item => `"${item}"`).join(', ')}`);

  // Validate brahma.apps.js.
  var errors = apps.reduce((p, c) => {
    return p.concat(validateAppsConfig(config[c], c));
  }, []).filter(Boolean);
  if (errors.length) {
    bad(errors.join('\n'));
  }
  else {
    good('OK (brahma.apps.js)');
  }


  // Print messages.
  console.log(messages.join('\n'));
  return valid;
};
