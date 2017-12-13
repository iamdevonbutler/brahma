## Plugin types

- `App`
- `Database`
- `Deploy`
- `Command`
- `Middleware`
- `Decorator`
- `Library`
- `Template`
- `Helpers`
- `Boilerplate`
- `Generate`
- `Logging`
- `Analysis`

Build
- [brahma-build-humans](@todo) - hooks into build and adds a humans.txt w/ data from config.


# Brahma plugin defaults

Database
- [brahma-database-mongodb-hosted](@todo) when mongodb === true

Deploy
- [brahma-deploy-vultr](@todo)

Templating
- [brahma-template-jsx](@todo) when templating === true

Apps
- [brahma-app-cron](@todo) - enabled if cron === true
- [brahma-app-mailgun](@todo) - enabled if mailgun === true

Commands
- @todo create a basic command plugin for something non essential to serve as documentation.

Helpers
- [brahma-helper-essentials](@todo)
- * can have multiple helpers.

Boilerplate
- [brahma-boilerplate-basic](@todo)
- [brahma-boilerplate-advanced](@todo)
- * can have multiple new plugins.
- @todo the name 'new' and were calling it 'boilerplate'.

Generate
- [brahma-generate-nginx](@todo) - creates config files.
- * can have multiple generate plugins.

Logger
- [brahma-logger-bunyan](@todo)
- [brahma-logger-logdna](@todo)
- * logdna has a config option to include bunyan, so u wouldnt use both here, but if u didnt
set that config, then u would configure both.

Middleware
- [brahma-middleware-essentials](@todo)

Decorators
- [brahma-decorators-essentials](@todo)
  - mcache
  - lcache
  - some http interfaces?

Static analysis
- [brahma-analysis-essentials](@todo) - checks require statements and this.





## Plugin types

App
- @todo smtp
- @todo cron
- @todo realtime

Database
- brahma-database-mongodb (has config option to integrate mongorules)

Templating
- brahma-template-handlebars
- brahma-template-jsx (https://www.npmjs.com/package/react-jsx)

@todo list plugins in each section too. e.g. put templating in templating.md

## Contributed plugins

The default, core Brahma plugins, can serve as documentation to the authors of contributed plugins. e.g. Developers looking to build a integration w/ "ejs" should check out the [brahma-template-handlerbars](@todo) plugin.
