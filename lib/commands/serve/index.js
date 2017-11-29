const path = require('path');
const {fork} = require('child_process');

var apps = {};

const bufferAndSend = (appName, interval, callback) => {
  var obj = {}, ids = {};
  if (!obj[appName]) {
    obj[appName] = [];
    ids[appName] = null;
  }
  return (message) => {
    if (!obj[appName].length) {
      ids[appName] = setInterval(() => {
        callback.call(null, obj[appName]);
      }, interval);
    }
    obj[appName].push(message);
    return ids[appName];
  };
};


function shutdownApps() {
  var keys = Object.keys(apps);
  keys.forEach(appName => {
    apps[appName].kill('SIGINT');
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
    var onMessage = bufferAndSend(appName, 3000, (data) => process.stdout(data));
    apps[appName] = fork(mainPath);
    apps[appName].on('message', onMessage);
  });
  if (!apps.length) return console.log('There are no apps to serve.');
};
