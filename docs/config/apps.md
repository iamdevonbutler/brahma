# Apps.js

The "apps.js" file is the main configuration file for Brahma.

The config is used by `build` to create you applications.

The config Object contains keys (app name) and values ("app config").

## Location
Edit your "apps.js":
- as a single file at: `./config/apps.js`.
- as a collection of files `./config/apps/index.js`.

## Structure
Your "apps.js" file can export either:
- an `Object` (static config).
- a `Function` that returns an `Object` (dynamic config).

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
module.exports = ({env, private, load}) => ({
  appName: {
    ...common,
    http: true,
  },
});
```
@todo list all injectables.

## App config (defaults).
```
appConfig {
  http: false,
  ssl: false,

  redis: false,
  lcache: false,
  mcache: false,

  static: false,

  lockdown: false,
  ratelimiter: false,

  database: false,

  cors: false,
  injectables: false,
};
```

Talk about each property.

injectables
- can override whats being in injected your not just adding.
