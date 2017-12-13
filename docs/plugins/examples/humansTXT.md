# Plugin `brahma-build-humans`

Adds a `./humans.txt` file to your app(s).

## Type
"Build" plugin.

## Installation
```javascript
// ./config/plugins.js
module.exports = ({load}) => {
  build: [{
    name: 'brahma-build-humans',
    options: {
      apps: [], // If empty, integrates into all apps.
      data: load.static('humans.txt')
    }
  }]
};
```

## Usage
