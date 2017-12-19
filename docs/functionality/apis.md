# APIs

## Brahma core APIs
- `resources`
- `static assets`
- `dependencies`



`utils` a resource. how does this work. what if users want their own utils. maybe they just replace methods. idk.
- `load()`
- `read()`
- `readStream()`

API
- load
- readStream
- read  // read reads data
  - read.static();
  - read.private('', true);
- env
  - env.get()
  - env.set()
- variables
  - variables.get()

Convention
- all reads via read are async?


## `load()` API

- `load.node(path)`
- `load.npm(path)`
- `load.github(path)`
- `load.resource(resourceName/path)`
- `load.private(path)`

By default, `load()` uses "absolute" pathing.

"Relative" pathing is possible w/ the `./` prefix.

Example:
```javascript
module.exports = ({load}) => {
  import: {
    'fs': load.node('fs'),
    'npmmodule': load.npm('npmmodule'),
    'githubrepo': load.github('username/reponame'),
    'googleApiKey': load.resource('private/keys').google,     
    'relativeResource': load.resource('./path'),     
    'googleApiKey': load.private('keys').google,
  }
};
```
