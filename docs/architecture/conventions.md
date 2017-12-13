# Conventions

## Dot syntax
- @todo
- give usage examples
- favors flat Objects and Arrays over nested data.
- explain why this is helpful for accessing object properties - interface would be weird w/o it
- keeps you config files looking simple - scales better

## $wrap it up
By convention, we prefix wrapped code, injected into our resources, w/ the dollar sign ("$").

This visual queue informs developers that the code's interface and/or data has been modified.

Here's a use case...Apps use many contributed libraries, and third party APIs. Often, the interfaces to these libraries clash w/ your coding style. e.g. Your memory cache uses callbacks instead of promises...In this case, you may want to wrap some of the cache functions to return promises, and inject the wrapped cache in your resources. You probably wont patch every cache function, so you also want to inject the original cache library just in case you're in need of more functionality.

```javascript
// ./config/apps.js
module.exports = ({env, load}) => {
  router: {
    ...common,
    redis: true,
    injectables: {
      $redis: load.resource('libraries', 'redis', {}),
    }
  }
};
```

```javascript
// ./endpoints/employees/getAll.js
module.exports = {
  location: 'router',
  async main({$redis}) {
    var result = await $redis.get('key');
    return result;
  }
};
```

## Namespacing
resourceType.name

Endpoints
app.group.name

@todo
