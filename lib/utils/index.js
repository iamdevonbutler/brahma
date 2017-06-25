const fs = require('fs');

const self = module.exports;

self.fileExists = (src) => {
  return fs.existsSync(src);
};
