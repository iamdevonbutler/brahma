module.exports = (resources) => {
  var keys, keys1;
  if (!resources) return resources;
  keys = Object.keys(resources);
  keys.forEach(resourceName => {
    keys1 = Object.keys(resources[resourceName]);
    keys1.forEach(resourceMethodName => {
      resources[resourceName][resourceMethodName] = {
        config: {},
        middleware: [],
        ...resources[resourceName][resourceMethodName]
      };
    });
  });
  return resources;
};
