// const {fileExists, logArray} = require('../lib/utils');
// const chalk = require('chalk');
// const chokidar = require('chokidar');
// const objectInterface = require('js-object-interface');
//
// Load Settings.
// const settingsPath = path.join(process.cwd(), 'config/settings.js');
// if (!fileExists(settingsPath)) {
//   console.error('Add a "./config/settings.js" file.');
//   return;
// }
// state.settings = loadSettings(settingsPath);

// Get active env.
// state.activeEnv = process.argv[2] || state.settings.localEnvironment;
// console.log(chalk.yellow(`Active environment: "${state.activeEnv}".`));

// Load apps config.
// const configPath = path.join(process.cwd(), 'config/apps.js');
// if (!fileExists(configPath)) {
//   console.error('Add a "./config/apps.js" file.');
//   return;
// }
// state.apps = loadAppsConfig(configPath, state.env);
//
// // Load env.
// const envPath = path.join(process.cwd(), 'config/env.js');
// // state.env = loadEnv(envPath, state.apps);
//
//
// // does the resource encapsulate update functionality - hooks that respond to update activty?
// state.env = objectInterface(loadEnv(envPath, state.apps), require('../lib/config/env'));
//
//
// // Load variables.
// const variablesPath = path.join(process.cwd(), 'config/variables.js');
// state.variables = loadVariables(variablesPath, state.env);
//
// // live update `state` during runtime.
// chokidar
//   .watch(path.join(process.cwd(), 'config/apps.js'))
//   .on('change', () => {
//     state.apps = loadAppsConfig(configPath, state.env);
//   });
//
// chokidar
//   .watch(path.join(process.cwd(), 'config/env.js'))
//   .on('change', () => {
//     state.env = loadEnv(envPath, state.apps);
//   });
//
// chokidar
//   .watch(path.join(process.cwd(), 'config/settings.js'))
//   .on('change', () => {
//     state.settings = loadSettings(settingsPath);
//   });
//
// chokidar
//   .watch(path.join(process.cwd(), 'config/variables.js'))
//   .on('change', () => {
//     state.variables = loadVariables(variablesPath, state.env);
//   });
