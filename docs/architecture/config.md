# Config

## Types
- Project config
- App config
  - Static app config
  - Dynamic app config

### Project config
- `apps.js`
- `deploy.js`
- `plugins.js`
- `settings.js`
- `dbs.js`
- `helpers.js`?
- `build.js`?
- `test.js`?

### App config
- `env.js` (dynamic - values change per environment)
- `variables.js` (static - values consistent across environments)

### Accessing config

- in resources
- in config


**No more process.env**
`process.env` limits values to type `String` only. The Brahma "Config API" supports all valid JS.

#### ./config/variables.js (static)

Simple "flat" key-value store.

Useful to store static (non changing) data such as API Keys.

Grouped per app.

All types allowed.

Methods:
- `variables.get(key)`;

```javascript
endpoint {
  require: {
    '{GoogleApi}': './libraries/google',
  },
  start({$ctx, variables, GoogleApi}) {
    var id = variables.get('google.api.id');
    $ctx.google = new GoogleApi(id);
  }
}
```

#### ./config/env.js (dynamic)

Simple "flat" key-value store.

Useful to store dynamic data that changes relative to its environment.

All types allowed.

Grouped per app.

Methods
- `config.env.get(key)`

### Integrating private ("sensative") data.
