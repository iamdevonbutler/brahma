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
  this.log(`-> ${name} start`);
  await func.apply(this, args);
  this.log(`-> ${name} complete (${Date.now() - startTime}ms)`);
};

/**
 * @param  {String} src
 * @return {Objcet}
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
