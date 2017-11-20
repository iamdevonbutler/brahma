const {isType} = require('../../utils');

// In a resource, when you do this.methodName(value), will pass in injectables, and
// $resources as param 1, and value as param 2.
module.exports = ({$resources, resource, injectables}) => {
  var keys, ctx = {};
  keys = Object.keys(resource);
  keys.forEach(key => {
    const isFunc = isType(resource[key], 'function');
    if (isFunc) {
      ctx[key] = (...args) => {
        return resource[key].call(ctx, {...injectables, ...$resources, $ctx: ctx}, ...args);
      };
    }
    else {
      ctx[key] = resource[key];
    }
  });
  return ctx;
};
