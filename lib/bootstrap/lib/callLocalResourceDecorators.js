const path = require('path');
const {isType, loadModules} = require('../../utils');
const commonDecorators = require('hash-common/decorators/common');
const serverDecorators = require('hash-common/decorators/server');

const appPath = path.join(process.cwd(), 'decorators');
const _decorators = {
  ...commonDecorators,
  ...serverDecorators,
  ...loadModules(appPath),
};

module.exports = (resources, injectables) => {
  var keys;
  keys = Object.keys(resources);
  keys.forEach(resourceName => {
    var keys1;
    keys1 = Object.keys(resources[resourceName]);
    keys1.forEach(resourceMethodName => {
      var decorators;
      const resource = resources[resourceName][resourceMethodName];
      decorators = resource.decorators;
      if (!decorators) return;
      if (isType(decorators, 'function')) {
        decorators = decorators.call(null, _decorators);
      }
      if (!isType(decorators, 'array')) {
        throw new Error(`${resourceName}.${resourceMethodName}.decorators error - resource.decorators accepts an array`);
      }
      const info = {resourceName, resourceMethodName};
      decorators.forEach(decorator => {
        var decoratorName;
        if (!isType(decorator, 'function')) {
          decoratorName = decorator;
          decorator = _decorators[decoratorName];
        }
        if (!decorator) {
          throw new Error(`${resourceName}.${resourceMethodName}.decorators error - decorator "${decoratorName}" not found.`);
        }
        decorator.call(null, {...injectables, resource, info});
      });
    });
  });
  return resources;
};
