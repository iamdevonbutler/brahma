module.exports = (resources, callbackName, args) => {
  var keys, keys1, promises = [];
  if (!resources) return Promise.resolve();
  keys = Object.keys(resources);
  keys.forEach(resourceName => {
    keys1 = Object.keys(resources[resourceName]);
    keys1.forEach(resourceMethodName => {
      const resource = resources[resourceName][resourceMethodName];
      const callback = resource[callbackName];
      if (callback) {
        let promise = callback.apply(null, args); // Calling a wrapped method (see decorateResources).
        promises.push(promise);
      }
    });
  });
  return Promise.all(promises);
};
