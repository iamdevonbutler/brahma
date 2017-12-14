# Communication

Apps communicate w/ eachother via a lightweight library over TCP.

"Secure" apps (apps.js `security=true`) use SSL over TCP.

## API

$request('http://www.google.com')
await $call('name', args)

## Example
@todo show multiple examples for endpoint located on same box and one for different box.
```javascript
// ./endpoints/router/employees/getAll.js
module.exports = {
  async main({}) {
    // @todo show how the api is normalized regardless of app location.
  }
};
```
