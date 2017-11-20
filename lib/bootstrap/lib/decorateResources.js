const {isType} = require('../../utils');
const decorateResourceCtx = require('./decorateResourceCtx');

// Wraps each resource method in a function that passes the injectables and
// other resources, as the first param, and then passes in the remaining args
// starting at param position 1. Prefix each top level resource w/ $ to identify it as a decorated.
module.exports = ({resources, injectables}) => {
  var keys, obj = {};
  keys = Object.keys(resources);
  keys.forEach(resourceName => {
    var keys1;
    obj[resourceName] = {};
    keys1 = Object.keys(resources[resourceName]);
    keys1.forEach(resourceMethodName => {
      var keys2;
      obj[resourceName][resourceMethodName] = {};
      const resource = resources[resourceName][resourceMethodName];
      const $resource = decorateResourceCtx({$resources: obj, resource, injectables});
      keys2 = Object.keys(resource);
      keys2.forEach(resourcePropertyName => {
        const resourceProperty = resource[resourcePropertyName];
        const isRouteCallback = resourcePropertyName === 'callback';
        if (isRouteCallback) {
          obj[resourceName][resourceMethodName][resourcePropertyName] = resourceProperty.bind($resource);
        }
        else if (isType(resourceProperty, 'function')) {
          obj[resourceName][resourceMethodName][resourcePropertyName] = (...args) => {
            // Calls a decorated resource method if decorators are used.
            return resourceProperty.call($resource, {...injectables, ...obj, $ctx: $resource}, ...args);
          };
        }
        else {
          obj[resourceName][resourceMethodName][resourcePropertyName] = resourceProperty;
        }
      });
    });
  });
  return obj;
};
