const fs = require('fs');
const path = require('path');

const self = module.exports;

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
    case 'timestamp':
      return self.isUnixTimestamp(value);
    default:
      return false;
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
  }
  return false;
};


self.objectAssignDeep = (...objs) => {
  var result = objs
    .filter(item => self.isType(item, 'object'))
    .reduce((p, c) => {
      var keys = Object.keys(c);
      keys.forEach(key => {
        if (self.isType(c[key], 'object')) {
          p[key] = self.objectAssignDeep(p[key] || {}, c[key]);
        }
        else {
          p[key] = c[key];
        }
      });
      return p;
  }, {});
  return result;
};

// object forEach.
self.forEach = (obj, cb) => {
  if (!self.isType(obj, 'object')) return false;
  var keys = Object.keys(obj);
  keys.forEach(key => cb(obj[key], key));
};

// object map.
self.map = (obj, cb) => {
  var keys, result;
  if (!self.isType(obj, 'object')) return false;
  keys = Object.keys(obj);
  result = keys.map(key => cb(obj[key], key));
  return result;
};

// object reduce.
// p, c are Object keys, not values.
self.reduce = (obj, cb, initialValue) => {
  var keys, result;
  if (!self.isType(obj, 'object')) return false;
  keys = Object.keys(obj);
  if (initialValue !== undefined) {
    result = keys.reduce((p, c) => cb(p, c), initialValue);
  }
  else {
    result = keys.reduce((p, c) => cb(p, c));
  }
  return result;
};

/**
 * Order an Object. Given an array of ordered Object keys
 * return an array of ordered Objects.
 * @param  {Object} obj
 * @param  {Array} order Array of ordered Object keys.
 * @return {Array}
 * @note we return an Array of Objects to preserve item keys.
 */
self.orderObj = (obj, order) => {
  if (!order || !order.length) return obj;
  var ordered = [], cache = [], keys;
  order.forEach(key => {
    if (obj[key] !== undefined) {
      ordered.push({key, value: obj[key]});
      cache.push(key);
    }
  });
  keys = Object.keys(obj);
  keys.forEach(key => {
    if (cache.indexOf(key) === -1) {
      ordered.push({key, value: obj[key]});
    }
  });
  return ordered;
}
