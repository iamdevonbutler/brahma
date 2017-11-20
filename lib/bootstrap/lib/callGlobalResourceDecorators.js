module.exports = (resources, injectables, decorators) => {
  var keys;
  if (!decorators) return resources;
  keys = Object.keys(resources);
  keys.forEach(resourceName => {
    var keys1;
    keys1 = Object.keys(resources[resourceName]);
    keys1.forEach(resourceMethodName => {
      const resource = resources[resourceName][resourceMethodName];
      const info = {resourceName, resourceMethodName};
      decorators.forEach(decorator => {
        decorator.call(null, {...injectables, resource, info});
      });
    });
  });
  return resources;
};
