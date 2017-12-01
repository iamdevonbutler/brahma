const loadConfig = require('../../utils/loadConfig');
const validateConfig = require('../../utils/validateConfig');
const loadEnv = require('../../utils/loadEnv');
const path = require('path');

// @todo use vorpal chalk and actually implement.
module.exports = ({config, settings}) => async (args, cb) => {
  var validated, messages = [];

  const environment = args.options.environment || settings.localEnvironment;

  var envPath = path.resolve(process.cwd(), 'brahma.env.js');
  var configPath = path.resolve(process.cwd(), 'brahma.config.js');

  const env = loadEnv(envPath, environment);
  const config = loadConfig(configPath, env);

  // Get all apps (brahma.config.js).
  const apps = Object.keys(config) || null;
  if (!apps.length) return console.log('No apps (brahma.config.js)');
  messages.push(`Apps:\n${apps.map(item => `- "${item}"`).join('\n')}`);

  // Validate brahma.config.js.
  var errors = apps.reduce((p, c) => {
    return p.concat(validateConfig(config[c], c));
  }, []).filter(Boolean);
  if (errors.length) {
    messages.push(errors.join('\n'));
  }
  else {
    messages.push('OK (brahma.config.js)');
  }

  // Log all messages.
  console.log(messages.join('\n\n'));

};
