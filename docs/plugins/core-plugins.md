# Core plugins

Plugins can be very powerful, so be careful when integrating them into your project. You should know how they work - so check out the code and make sure they're not complete garbage.

Here is a list of core "plugins" created and supported by Brahma:

## Database
- [brahma-database-mongodb](@todo)

## Deploy
- [brahma-deploy-vultr](@todo)

## Template
- [brahma-template-jsx](@todo)

## App
- [brahma-app-cron](@todo)
- [brahma-app-mailgun](@todo)
- [brahma-app-realtime](@todo)
- [brahma-app-documentation](@todo)

## Command
- [brahma-command-watch](@todo)

## Helper
- [brahma-helper-essentials](@todo)

## Generate
- [brahma-generate-nginx](@todo) - creates config files.
- * can have multiple generate plugins.

## Logger
- [brahma-logger-bunyan](@todo)
- [brahma-logger-logdna](@todo)
- * logdna has a config option to include bunyan, so u wouldnt use both here, but if u didnt
set that config, then u would configure both.

## Library
- [brahma-library-essentials](@todo)

## Middleware
- [brahma-middleware-essentials](@todo)

## Decorator
- [brahma-decorator-essentials](@todo)
  - mcache
  - lcache
  - some http interfaces?

## Static analysis
- [brahma-analysis-essentials](@todo) - checks require statements and this.
