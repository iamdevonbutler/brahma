const {getDirectoriesSync, getFilesSync} = require('../utils');
const path = require('path');

module.exports = (src) => {
  var objs, obj = {};
  objs = getDirectoriesSync(src).concat(getFilesSync(src));
  objs.forEach(obj1 => {
    var dirPath = path.join(src, obj1);
    obj[obj1] = require(dirPath);
  });
  return obj;
};
