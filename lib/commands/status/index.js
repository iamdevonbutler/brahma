const loadConfig = require('../../utils/loadConfig');
const validateConfig = require('../../utils/validateConfig');
const loadEnv = require('../../utils/loadEnv');
const path = require('path');
const chalk = require('chalk');

var messages = [];

const good = (input) => messages.push(chalk.green(input));
const bad = (input) => messages.push(chalk.red(input));
const ok = (input) => messages.push(input);

module.exports = ({config, settings}) => async (args) => {
  const environment = args.options.environment || settings.localEnvironment;

  // Get all apps (brahma.config.js).
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

  // Log all messages.
  console.log(messages.join('\n'));
  return true;

};
