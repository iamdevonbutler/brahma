## brahma `helper`

## Commands
- sslVerify - open browser w/ link to (https://www.ssllabs.com/ssltest/)
- eol - \n -> eol.
- iwantmynameDomain - https://github.com/iwantmyname/iwmn-js
- latestDependencies - updates pack.j w/ latest versions of packages.
- looseEnds - see helpers/commands/looseEnds.

* have a way to add these to status. so the user could say lets run the \n helper w/ status.
- in settings config, have a status property.

## Writing custom `helper(s)`
```
mkdir ./plugins/helpers
touch ./plugins/helpers/index.js
```
```javascript
// index.js
module.exports = () => ({
  // @todo
});
```

## Plugins
- [`brahma-helper-essentials`](@todo) (core)
