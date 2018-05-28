// @file loads configs, and watches config files for changes and live updates your stateful config obj,
const {fileExists, getFilesSync} = require('../../lib/utils');
const chalk = require('chalk');
const objectInterface = require('js-object-interface');
const isType = require('js-type-checking');
const path = require('path');

// @todo integrate w/ status so it runs everytime and makes sure the config files arent bullshit.


/**
 * Loads and hotreloads user config files.
 * @param  {String} configRoot
 * @param  {Array of Strings|String} [configNames] useful for loading a single config file.
 * @return {Object}
 */

// @todo status, validate each config and ensure there are no missing confgs.
//
//
//
// @next make sure status can run validation on configs.
//
//
// @note, we allow the configNames param that supports loading a single or X configs
// for the use of the livereloader, which, on file change, reloads the config.
module.exports = (configRoot, configNames = null) => {
  const obj = {}, errors = [];

  const validationRoot = path.resolve(__dirname, '../validators/config');
  if (isType(configNames, 'string')) {
    if (configNames.slice(-3) !== '.js') {
      configNames += '.js';
    }
    configNames = [configNames];
  }
  if (!configNames) {
    configNames = getFilesSync(configRoot);
  }

  configNames.forEach(configName => {
    var config;

    // Load config.
    const configPath = path.join(configRoot, configName);
    if (!fileExists(configPath)) {
      console.error(`Add a "./config/${configName}" file.`);
      return;
    }
    config = require(configPath);

    // Validate config.
    const validatorPath = path.join(validationRoot, configName);
    const validator = require(validatorPath);
    if (validator[configName]) {
      var err =  validator[configName].call(null, config, configName);
      if (err) {
        errors.push(err);
        return;
      }
    }

    configName = configName.slice(0, -3); // Remove trailing ".js" suffix.
    obj[configName] = config;
  });

  return objectInterface(obj);
};
