# Recommended plugins

Plugins can be very powerful, so be careful when integrating them into your project. Here is a list of core "plugins" created and supported by Brahma:

List organized by ["plugin" type](@todo)

## Database
- [brahma-database-mongodb](@todo)

## Deploy
- [brahma-deploy-vultr](@todo)

## Templating
- [brahma-template-jsx](@todo)

## App
- [brahma-app-cron](@todo)
- [brahma-app-mailgun](@todo)

## Commands
- @todo make `watch` a command plugin

## Helpers
- [brahma-helper-essentials](@todo)
- * can have multiple helpers.

## Boilerplate
- [brahma-boilerplate-basic](@todo)
- [brahma-boilerplate-advanced](@todo)
- * can have multiple new plugins.
- @todo the name 'new' and were calling it 'boilerplate'.

## Generate
- [brahma-generate-nginx](@todo) - creates config files.
- * can have multiple generate plugins.

## Logger
- [brahma-logger-bunyan](@todo)
- [brahma-logger-logdna](@todo)
- * logdna has a config option to include bunyan, so u wouldnt use both here, but if u didnt
set that config, then u would configure both.

## Middleware
- [brahma-middleware-essentials](@todo)

## Decorators
- [brahma-decorators-essentials](@todo)
  - mcache
  - lcache
  - some http interfaces?

## Static analysis
- [brahma-analysis-essentials](@todo) - checks require statements and this.
