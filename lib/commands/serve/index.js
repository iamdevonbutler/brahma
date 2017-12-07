const path = require('path');
const {fork} = require('child_process');
const {EOL} = require('os');

var servers = {};

const bufferAndSend = (appName, interval, callback) => {
  var obj = {};
  if (!obj[appName]) obj[appName] = [];
  return (message) => {
    if (!obj[appName].length) {
      setTimeout(() => {
        callback.call(null, obj[appName]);
        obj[appName].length = 0;
      }, interval);
    }
    obj[appName].push(message);
  };
};

// @note not pure.
function shutdownApps() {
  var keys = Object.keys(servers);
  keys.forEach(appName => {
    servers[appName].kill('SIGTERM');
  });
};

process.on('exit', shutdownApps);
process.on('SIGTERM', shutdownApps);
process.on('SIGINT', shutdownApps);

module.exports = ({apps, settings, env, activeEnv, ariables}) => async (args) => {
  const keys = Object.keys(apps);

  // dont need nodemon for restarts.
  // just watch files, and on change, fork another process.

  keys.forEach(appName => {
    var appPath = path.join(process.cwd(), 'build', appName);
    var mainPath = path.join(appPath, 'bin/startup.js');
    var onMessage = settings.bufferServerLogs ? bufferAndSend(appName, 3000, data => {
      var output = data.map(item => appName + '\t' + item).join(EOL);
      console.log(output);
    }) : console.log;
    servers[appName] = fork(mainPath);
    servers[appName].on('message', onMessage);
  });
  if (!servers.length) console.log('There are no apps to serve.');
};
