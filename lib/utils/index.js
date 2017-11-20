const fs = require('fs');

const self = module.exports;

self.fileExists = (src) => {
  return fs.existsSync(src);
};

self.runBefore = (vorpal) => ( ...args) => {
  const command = args.pop();
  return function(...args1) {
    args.forEach((arg) => vorpal.execSync(arg));
    command.apply(this, args1);
  };
};

self.log = (func, name) => {
  return function(...args) {
    const startTime = Date.now();
    this.log(`-> ${name} start`);
    func.apply(this, args);
    this.log(`-> ${name} complete (${Date.now() - startTime}ms)`);
  };
};
