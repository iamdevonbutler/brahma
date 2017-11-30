const path = require('path');
const Router = require('koa-router');
const {isType, loadModules} = require('../utils');
const commonMiddleware = require('hash-common/middleware/common');
const serverMiddleware = require('hash-common/middleware/server');
const router = new Router();

const appPath = path.join(process.cwd(), 'middleware');
const _middleware = {
  ...commonMiddleware,
  ...serverMiddleware,
  ...loadModules(appPath),
};

module.exports = ({$resources, injectables}) => {
  var keys, keys1;
  keys = Object.keys($resources);
  keys.forEach(resourceName => {
    keys1 = Object.keys($resources[resourceName]);
    keys1.forEach(resourceMethodName => {
      const $resource = $resources[resourceName][resourceMethodName];
      const {method, route, callback} = $resource;
      if (method && callback) {
        let {middleware = []} = $resource;
        if (isType(middleware, 'function')) {
          middleware = middleware.call(null, _middleware);
        }
        if (!isType(middleware, 'array')) {
          throw new Error(`${resourceName}.${resourceMethodName}.middleware error - resource.middleware accepts an array`);
        }
        middleware = middleware.map(item => {
          if (!isType(item, 'function')) {
            if (!_middleware[item]) throw new Error(`${resourceName}.${resourceMethodName}.middleware error - middleware "${item}" not found.`);
            item = _middleware[item];
          }
          return (ctx, next) => {
            item.call(null, {...injectables, ...$resources, $ctx: $resource, ctx, next});
          };
        });
        const endpointPath = path.join('/', resourceName, route || resourceMethodName);
        const name = `${resourceName}/${resourceMethodName}`;
        router[method](name, endpointPath, ...middleware, async (ctx, next) => {
          await callback.call($resource, {...injectables, ...$resources, isRouteCallback: true, $ctx: $resource, ctx, next});
        });
      }
      else if (method || callback) {
        console.warn(`Warning - add properties "method" and "callback" to "${resourceName}.${resourceMethodName}" to register the route.`);
      }
    });
  });
  return router;
};
