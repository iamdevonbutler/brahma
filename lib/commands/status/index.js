const loadConfig = require('../../utils/loadConfig');
const validateConfig = require('../../utils/validateConfig');
const loadEnv = require('../../utils/loadEnv');
const path = require('path');

// @todo use vorpal chalk and actually implement.
module.exports = async (args, cb) => {
  var validated, obj = {};

  var envPath = path.resolve(process.cwd(), 'brahma.env.js');
  var configPath = path.resolve(process.cwd(), 'brahma.config.js');

  const env = loadEnv(envPath);
  const config = loadConfig(configPath, env);

  const appNames = Object.keys(config).join(', ') || null;
  if (!appNames) return console.log('No apps (brahma.config.js)');

  console.log(`brahma.config.js apps: ${appNames}`);

  var apps = Object.keys(config);
  var errors = apps.reduce((p, c) => {
    return p.concat(validateConfig(config[c], c));
  }, []).filter(Boolean);
  obj['brahma.config.js'] = errors.length ? errors : 'OK';

  // console.log('brahma.config.js (OK)');

};
