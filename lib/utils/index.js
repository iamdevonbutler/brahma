const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const self = module.exports;

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

self.log = (func, name) => async function(...args) {
  const startTime = Date.now();
  await func.apply(this, args);
  this.log(`-> ${name} complete (${Date.now() - startTime}ms)`);
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

self.isType = (value, type) => {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && Number.isNaN(value) === false;
    case 'boolean':
      return value === true || value === false;
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && value !== null && Array.isArray(value) === false;
    case 'null':
      return value === null;
    case 'undefined':
      return value === undefined;
    case 'function':
      const tag = Object.prototype.toString.call(value);
      return tag === '[object Function]' || tag === '[object AsyncFunction]' || tag === '[object GeneratorFunction]' || tag === '[object Proxy]';
    case 'symbol':
      return typeof value === 'symbol';
    case 'NaN':
      return Number.isNaN(value);
    case 'date':
      return value instanceof Date;
    default:
      throw new Error(`Invalid value for arg "type": ${type}`);
  }
};

self.getType = (value) => {
  // @note important that date comes before object. Dates are technically objects
  // but here we want to explicitly define them as dates.
  var types = ['string', 'number', 'boolean', 'array',  'date', 'object', 'function',
  'null', 'undefined', 'symbol', 'NaN'];
  for (let key in types) {
    if (self.isType(value, types[key])) {
      return types[key];
    }
  }˜
  return false;
};


self.objectAssign = (...objs) => {
  var result = objs
    .filter(item => self.isType(item, 'object'))
    .reduce((p, c) => {
      var keys = Object.keys(c);
      keys.forEach(key => {
        if (self.isType(c[key], 'object')) {
          p[key] = self.objectAssign(self.isType(p[key], 'object') ? p[key] : {}, c[key]);
        }
        else {
          p[key] = c[key];
        }
      });
      return p;
  }, {});
  return result;
};
