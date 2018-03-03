const {getDirectoriesSync, getFilesSync} = require('../utils');
const path = require('path');

module.exports = (src) => {
  var obj = {};
  const directories = getDirectoriesSync(src);
  directories.forEach(directory => {
    var dirPath = path.join(src, directory);
    obj[directory] = require(dirPath);
  });
  return obj;
};
