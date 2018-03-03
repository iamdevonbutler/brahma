const path = require('path');
const {readdirSync} = require('fs');
const {orderObj} = require('../../utils');

const self = module.exports;


// status on save feature?
// might not want to show the success messages (there will be a lot of them) and just show the
// errors. pass a flag to show the successes.


const commandOrder = [
  'getApps',
  'validateAppsConfig',
  'validateEnv',
];

function getInfo(info, key) {
  info = info && info.length ? info.map(item => key + ': ' + item) : [`${key}: (\u2713)`];
  return info;
}

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
        if (result.errors) errors = errors.concat(result.errors);
        info = info.concat(getInfo(result.info, key));
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
      if (result.errors) errors = errors.concat(result.errors);
      info = info.concat(getInfo(result.info, command));
    }
  }
  return {
    info: info.length ? info : null,
    errors: errors.length ? errors : null,
  };
};
