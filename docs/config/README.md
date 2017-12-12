# Config

## Organization
All config files can be organized:
- as a `single file` at: `./config/TYPE.js`.
- as a `collection of files` w/i a folder `./config/TYPE/index.js`.

Larger projects may warrant "folder" organization, while smaller projects will benefit from the simplicity of "file" organization.

### File organization
```javascript
// ./config/apps.js
// sample apps.js "file" style config.
const common = {};
module.exports = {
  router: {
    ...common,
    http: true,
    ssl: {},
  },
  worker: {
    ...common,
  }
};
```

### Folder organization
```javascript
// ./config/apps/index.js
// sample apps.js "folder" style config.
const common = {};
module.exports = ({load}) => ({
  router: load('./config/apps/router', common), // @note Brahma only uses absolute paths.
  worker: load('./config/apps/worker', common),
});
```
