# Plugin config

You configure "plugins" in your `./config/plugins.js` file.

## Syntax

Export types:
- Object

The exported Object MUST contain:
- keys `String` - [plugin type](@todo) e.g. "command" or "decorator".
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
