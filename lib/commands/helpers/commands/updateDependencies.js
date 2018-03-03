const self = module.exports;

self.config = {
  name: 'updateDependencies', // maybe have this be optional and use the filename.
};

// how to install local dependencies.
// need to be able to both install new dependencies via command line and
//   recgonize from changes in dependencies.js that new deps have been added.
// update to latest major, minor, patch
// what about dependencies on github.
//   maybe just support github and npm dependencies.
//   need to support scoped npm, private npm, and private github.
self.main = ({dependencies}) => {
  dependencies.forEach(dependency => {
    // list each dependency
    // list latest M (major) m (minor) p (patch)
  });
};
