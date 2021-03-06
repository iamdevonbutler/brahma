# `apps.js` config

The "apps.js" file is the main configuration file for Brahma.

The config is used by `build` to create you applications.

The config Object has "keys" (**app name**) with Object "values" (**app config**).

## Location
Edit your "apps.js":
- as a single file at: `./config/apps.js`.
- as a collection of files `./config/apps/index.js`.

## Structure
Your "apps.js" file can export either:
- an `Object` (static config).
- a `Function` that returns an `Object` (dynamic config).

*See [config organization documentation](@todo)*

### Exporting an Object.
```javascript
const common = {};
module.exports = {
  appName: {
    ...common,
    http: true,
  },
};
```

### Exporting a Function.
```javascript
//@todo list all DI args.
module.exports = ({env, private, load}) => ({
  appName: {
    ...common,
    http: true,
  },
});
```


## App config (defaults).
App config uses an opt-in strategy. The default "barebones" app manifests as a "worker" app, that communicates w/ other apps via a "distributed" "TCP" messaging service (can be configured to use "TLS" w/ the `secure` option).

*See the docs on [privacy](@todo) to learn how the "private" injectable manages and integrates sensitive data in your configs.*
```
appConfig {
  http: false,
  security: false,
  nginx: false,

  redis: false,
  lcache: false,
  mcache: false,

  database: false,
  logger: false,

  static: false,

  cors: false,
  ratelimiter: false,

  injectables: false,
};
```

### http
```javascript
module.exports = ({load, env}) => ({
  config {
    whitelist: [],
    blacklist: [],
    password: load.private('passwords').routerPass,
    port: env.get('port'),
    ipv6: '',
  }
});
```
options:
- `whitelist [Array=null]` - Allow nobody except whitelisted IPs
- `blacklist [Array=null]` - Allow everybody except blacklist IPs
- `password [String=null]` - password protect app via Basic Auth.
- `port <Number|String=3000>` - port

*Note: you can configure a `blacklist` OR a `whitelist` NOT both.*
### security
```javascript
({read, env}) => async ({
  config {
    key: await read.private('certs/key.pem'),
    cert: await read.private('certs/cert.pem'),
  }
});
```

### proxy

### redis

### lcache
[LRU cache](https://github.com/isaacs/node-lru-cache) ("least recently used").

```javascript
endpoint {
  name: 'getDogs',
  start({lcache, $ctx}) {
    $ctx.lcache = lcache({max: 100});
  },
  async main({$ctx}, type) {
    var result = $ctx.lcache.get(type);
    if (!result) {
      result = await $ctx.call('dogs', 'verifyType', type);
      $ctx.lcache.set(type, result);
    }
    return result;
  }
}
```
*Learn how to use `lcache` and `mcache` w/ "decorators" [here](@todo)*

### mcache
[memory cache](https://github.com/ptarjan/node-cache)
```javascript
endpoint {
  name: 'getDogs',
  async main({$ctx, mcache}, type) {
    var result = mcache.get(type);
    if (!result) {
      result = await $ctx.call('dogs', 'verifyType', type);
      mcache.set(type, result);
    }
    return result;
  }
}
```
*Learn how to use `lcache` and `mcache` w/ "decorators" [here](@todo)*

### logger

### static
@todo its called static but it lives in public?


### injectables
- can override whats being in injected your not just adding.
