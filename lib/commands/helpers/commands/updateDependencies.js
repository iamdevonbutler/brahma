// how to install local dependencies.
// need to be able to both install new dependencies via command line and
//   recgonize from changes in dependencies.js that new deps have been added.
// update to latest major, minor, patch
// what about dependencies on github.
//   maybe just support github and npm dependencies.
//   need to support scoped npm, private npm, and private github.

module.exports = {
  name: 'updateDependencies', // maybe have this be optional and use the filename.
  description: 'Update dependencies to a newer version',
  main() {
    // list each dependency
    // list latest M (major) m (minor) p (patch)
    console.log(222222);
  }
};
