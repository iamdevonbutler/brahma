# Plugins

Plugins integrate into Brahma from:
- npm/git repo
- local
@todo examples.

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

Static analysis
- [brahma-analysis-essentials](@todo) - checks require statements and this.

## Contributing plugins

@TODO make sure we add the plugin to the big plugin list and the specific plugin list

talk about the interfaces and examples.
