const loadConfig = require('../../utils/loadConfig');
const validateConfig = require('../../utils/validateConfig');
const loadEnv = require('../../utils/loadEnv');
const path = require('path');
const chalk = require('chalk');

var messages = [], valid = true;

const good = (input) => messages.push(chalk.green(input));
const bad = (input) => {
  valid = false;
  messages.push(chalk.red(input));
};
const ok = (input) => messages.push(input);

module.exports = ({config, settings, env}) => async (args) => {
  
  // Log all apps.
  const apps = Object.keys(config) || null;
  if (!apps.length) return console.log('No apps (brahma.config.js)');
  ok(`Apps: ${apps.map(item => `"${item}"`).join(', ')}`);

  // Validate brahma.config.js.
  var errors = apps.reduce((p, c) => {
    return p.concat(validateConfig(config[c], c));
  }, []).filter(Boolean);
  if (errors.length) {
    bad(errors.join('\n'));
  }
  else {
    good('OK (brahma.config.js)');
  }

  // Print messages.
  console.log(messages.join('\n'));
  return valid;
};
