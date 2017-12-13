# Plugin configuration

You configure "plugins" in your `./config/plugins.js` file.

## Syntax

Export types:
- Function
- Object

The exported Function MUST return an Object.

The exported Object MUST contain:
- keys `String` - [plugin type](@todo) e.g. "app", "decorator", "...".
- values `Array` of `Objects`

Each Array item MUST be an `Object` containing:
- &lt;`name`&gt;
- [`user`=null]
- [`source`='npm']
- [`version`='latest']
- [`options`=null]

## Example

```javascript
module.exports = {
  commands: [
    {name: 'brahma-command-watch', user: 'iamdevonbutler', source: 'git', version: '*', options: {}},
  ],
  app: [],
  build: [],
  database: [],
  deploy: [],
  command: [],
  middleware: [],
  decorator: [],
  library: [],
  template: [],
  helpers: [],
  boilerplate: [],
  generate: [],
  logging: [],
  analysis: [],
}
```
