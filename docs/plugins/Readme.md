# Plugins

Plugins extend / modify the behavior of Brahma at every level. See the ["plugin" architecture page](@todo) for a more detailed understanding.

Plugins integrate into Brahma from:
- `npm`
- `git`
- `project` (./plugins/NAME)

View the "plugin" configuration docs [here](@todo).

## Contributing plugins
The default, core Brahma plugins, can serve as documentation to the authors of contrib plugins.

e.g. developers looking to build a integration w/ "ejs" should check out the [brahma-template-handlebars](@todo) plugin.

### Naming plugins
```javascript
brahma-${pluginType}-${pluginName}
```

"pluginType" must be a valid ["plugin" type](@todo)
"pluginName" can be anything - separate multiple words using camelCase.

"App" plugins can have plugins themselves. Naming app plugin plugins follows the convention:
```javascript
brahma-${pluginType}-${pluginName}-plugin-${name}
```

### Featuring plugins
Email me, at jpescione@gmail.com, to feature your plugin [here](@todo ./list).
