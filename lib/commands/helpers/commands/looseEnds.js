const self = module.exports;

self.config = {
  name: 'looseEnds', // maybe have this field be optional and use the filename. this is a general brahma pattern.
};

// use cases:
//  unused dependencies. deps listed in config/dependencies that are not included in code (endpoints/hooks/libraries/...)
//  if ^ is the only use case, call this "unusedDependencies"
self.main = () => {

};
