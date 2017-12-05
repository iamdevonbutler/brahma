const path = require('path');
const {readdirSync} = require('fs');
const {orderObj} = require('../../utils');

const self = module.exports;

const commandOrder = [
  'getApps',
  'validateAppsConfig',
  'validateEnv',
];

self.autocompleteOptions = () => {
  var obj = Object.keys(self.loadCommands(false));
  return obj;
};

// @note not pure.
self.loadCommands = (order = true) => {
  var files, obj = {}
  files = readdirSync(path.join(__dirname, 'commands'));
  files.forEach(file => {
    obj[file.slice(0, -3)] = require(path.join(__dirname, 'commands', file)).main;
  });
  if (order) {
    let ordered = orderObj(obj, commandOrder);
    return ordered;
  }
  return obj;
};

self.main = (data) => async (args) => {
  const {apps, settings, env, activeEnv, variables} = data;
  const {command} = args;

  var info = [], errors = [];

  if (!command) {
    const commands = self.loadCommands(true);
    await (async () => {
      commands.forEach(async ({key, value}) => {
        var result = await value.call(null, data);
        if (result.info) info = info.concat(result.info);
        if (result.errors) errors = errors.concat(result.errors);
      });
    })();
  }
  else {
    const commands = self.loadCommands(false);
    if (!commands[command]) {
      errors.push(`Invalid command: "${command}".`);
    }
    else {
      let result = await commands[command].call(null, data);
      if (result.info) info = info.concat(result.info);
      if (result.errors) errors = errors.concat(result.errors);
    }
  }
  return {
    info: info.length ? info : null,
    errors: errors.length ? errors : null,
  };
};
