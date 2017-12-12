# Decorators

## Examples

### mcache (simple)
```javascript
// ./endpoints/dogs/getDogs.js
endpoint {
  decorators: ['mcache'],
  async main({request}, type) {
    return type;
  }
}
```
```javascript
// ./decorators/mcache.js
// @todo this is bad.
module.exports = {
  async main({mcache, $resource}) {
    var result = mcache.get($resource.name);
    if (!result) {
      result = await $resource.call('...');
      mcache.set($resource.name, result);
    }
    return result;
  }
};
```

### lcache (intermediate)
@todo
