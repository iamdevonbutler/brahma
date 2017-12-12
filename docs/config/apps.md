# Apps.js

The "apps.js" file is the main configuration file for Brahma.

The config is used by `build` to create you applications.

## Location
`./config/apps.js` or `./config/apps/index.js`

## Structure
Your "apps.js" file can export either:
- an `Object`
- a `Function` that returns an `Object`.

```javascript
module.exports = {
  appName: {
    ...common,
    http: true,
  },
};
```

```javascript
module.exports = ({env}) => ({
  appName: {
    ...common,
    http: true,
  },
});
```

## App config (defaults).
```
{
  http: false,
  ssl: false,
}
```

Talk about each property.

injectables
- can override whats being in injected your not just adding.
