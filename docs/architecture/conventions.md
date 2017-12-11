# Conventions

## $wrap it up
By convention, we prefix wrapped code w/ the dollar sign ("$").

This queue informs developers that the code's interface and/or data has been modified.

Here's a use case...Apps use many contributed libraries, and third party APIs. Often, the interfaces to these libraries clash w/ your coding style. e.g. Your memory cache uses callbacks instead of promises...In this case, you may want to wrap some of the cache functions to return promises, and inject the wrapped cache in your resources. You probably wont patch every cache function, so you also want to inject the original cache library just in case you're in need of more functionality.

```javascript
// ./config/apps.js
module.exports = ({env, load}) => {
  api: {
    ...common,
    redis: true,
    injectables: {
      $redis: load('./libraries/redis'),
    }
  }
};
```

## Namespacing
resourceType.name

Endpoints
app.group.name

@todo
