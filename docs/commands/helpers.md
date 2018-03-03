## brahma `helpers`

```
$brahma helper (lists all helpers w/ owner field)
$brahma helper sslVerify
$brahma helper eol
$brahma helper iwantmyname
$brahma helper latestDependencies
$brahma helper looseEnds

```

## Commands
- sslVerify - open browser w/ link to (https://www.ssllabs.com/ssltest/analyze.html?d=www.google.com)
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

@todo
- if helpers are provided by plugins, display an "owner" field in the helper listing.
- vultr registers w/ helper openVultr
- s3 registers openS3
- helper - get bandwidth - bandwidth analysis page - hook from remote plugin
