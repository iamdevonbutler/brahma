// use cases:
//  unused dependencies. deps listed in config/dependencies that are not included in code (endpoints/hooks/libraries/...)
//  if ^ is the only use case, call this "unusedDependencies"



module.exports = {
  name: 'unusedDependencies', // maybe have this field be optional and use the filename. this is a general brahma pattern.
  description: 'lists installed dependencies unused in code',
  main() {
    console.log(1111111);
  }
};
