const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const {EOL} = require('os');

const self = module.exports;

// self.log = (func, name) => async function(...args) {
//   const startTime = Date.now();
//   await func.apply(this, args);
//   this.log(`-> ${name} complete (${Date.now() - startTime}ms)`);
// };
//

self.cols = (rows, ...widths) => {
  var str = '';
  rows.forEach(row => {
    row.forEach((item, i) => {
      if (widths[i]) {
        if (item.length > widths[i]) {
          item = item.slice(0, widths[i]) + EOL + item.slice(widths[i])
        }
        else {
          let padding = widths[i] - item.length;
          while (padding--) {
            item += ' ';
          }
        }
      }
      str += item;
    });
    str += EOL;
  });
  return str;
};

self.logArray = (obj, error = false, color = true) => {
  if (error) {
    if (color) {
      console.error(obj.map(item => chalk.red('-> ' + item)).join(EOL));
    }
    else {
      console.error(obj.map(item => '-> ' + item).join(EOL));
    }
  }
  else {
    console.log(obj.map(item => '-> ' + item).join(EOL));
  }
};

self.logError = (err, color = true) => {
  if (color) {
    console.error('->' + chalk.red(err));
  }
  else {
    console.error('->' + err);
  }
};

self.getFilesSync = (src) => {
  return fs.readdirSync(src)
    .filter(file => fs.lstatSync(path.join(src, file)).isFile());
};

self.getDirectoriesSync = (src) => {
  return fs.readdirSync(src)
    .filter(file => fs.lstatSync(path.join(src, file)).isDirectory());
};

self.mkdirSyncSafe = (src) => {
  if (!self.directoryExists(src)) {
    return fs.mkdirSync(src);
  }
  return null;
};

self.fileExists = (src) => {
  return fs.existsSync(src);
};

self.directoryExists = (src) => {
  return fs.existsSync(src);
};

self.runBefore = (vorpal) => (...args) => {
  const command = args.pop();
  return async function(...args1) {
    args.forEach(async arg => {
      await vorpal.execSync(arg);
    });
    await command.apply(this, args1);
  };
};

/**
 * @param  {String} src
 * @return {Object}
 */
self.getObjFromDirectory = (src) => {
  var obj = {};
  if (!self.directoryExists(src)) return obj;
  const directories = self.getDirectoriesSync(src);
  directories.forEach(directory => {
    const resourcePath = path.join(src, directory);
    const files = self.getFilesSync(resourcePath);
    obj[directory] = {};
    files.forEach(filename => {
      const methodName = filename.slice(0, filename.lastIndexOf('.'));
      const methodPath = path.join(resourcePath, filename);
      obj[directory][methodName] = require(methodPath);
    });
  });
  return obj;
};
