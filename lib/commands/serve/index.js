const path = require('path');
const {fork} = require('child_process');

var apps = {};

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

function shutdownApps() {
  var keys = Object.keys(apps);
  keys.forEach(appName => {
    apps[appName].kill('SIGTERM');
  });
};

process.on('exit', shutdownApps);
process.on('SIGTERM', shutdownApps);
process.on('SIGINT', shutdownApps);

module.exports = config => (args, cb) => {
  const keys = Object.keys(config);
  keys.forEach(appName => {
    var appPath = path.join(process.cwd(), 'build', appName);
    var mainPath = path.join(appPath, 'server.js');
    var onMessage = bufferAndSend(appName, 3000, console.log);
    apps[appName] = fork(mainPath);
    apps[appName].on('message', onMessage);
  });
  if (!apps.length) console.log('There are no apps to serve.');
};
