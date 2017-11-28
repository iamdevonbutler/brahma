const path = require('path');
const commandExistsSync = require('command-exists').sync;
const shell = require('shelljs');
const vorpal = require('vorpal')();
const childProcess = require('child_process');

module.exports = config => (args, cb) => {
  var stmuxExists, command = '';

  stmuxExists = commandExistsSync('stmux');
  if (!stmuxExists) {
    // @todo prompt user to install stmux.
    return;
  }

  process.on('exit', () => {
    console.log(11111);
    childProcess.execSync('stmux -- [ vim ]');
    // shell.exec();

  });
    // childProcess.execSync('stmux -- [ vim ]');

  vorpal.execSync('exit');
  return;

  // const apps = Object.keys(config.apps);
  // apps.forEach(appName => {
  //   var appPath = path.join(process.cwd(), 'build', appName);
  // });
};
