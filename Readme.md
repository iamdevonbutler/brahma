<p align="center">
  <a href="http://gulpjs.com">
    <img height="300" width="300" src="https://thumbs.dreamstime.com/b/metatrons-cube-flower-life-vector-illustration-83115526.jpg">
  </a>
  <p align="center">An omniservices framework</p>
</p>

# Brahma

omniservices framework

A command line application - given a singular source of ambigious "resources" it creates a integrated collection of nodejs microservices.

Koa isn't really a framework, it's more of a library.

This is a framework, w/ the benefits of:
- code reuse
- common config
- common utils
- worker delegation
- service delegation

- cron service
- api service
- worker services
- custom service
- realtime?

Commands
- status
- watch
- build
- deploy

cron and realtime? for free

Documentation built in.

zero downtime deployments.

use the word "opinionated" somewhere.

Terminology?
resources are made up of ???? modules?

Philosophy
- unix philosophy, do 1 thing, and decorate to do more. u want lots of little modules.
- each root folder e.g. /addons /apps /resources should have a singluar root purpose
  - e.g. apps, config and customization for servers
  - e.g. dbs, config for dbs
  - e.g. resources, application code for servers
- no `this` (especially w/ function decoration)
- as above so below (eslintrc, npmrc, ...)
- flexibility for what you need. we are trying to enforce commonalities, standards, across our apps to make the more predictable for bug prevention.
- code sharing (makes it super easy to share your `decorators`, `middleware`, `config`, `services`, ...)
- modularity

Explaination of folder structure
- ./services - services return an obj that provide a "service". and im using the word service literally and vaguely. in other words, its code that does stuff. it can be anything that contributes to the functionality of a service(s)
- ./middleware
- ./static - common static assets to all apps. all files will be copied over to each app.
- ...

Clustering
Brahma uses throng. Assign env var `WEB_CONCURRENCY`.

Lifecycle states
- `startup`
- `run`
- `shutdown`
* process.env.lifecycle is not available to users (@todo validate peoples env).

Env
- @todo list required env.
- PORT
- NODE_ENV (default)
- APP_NAME (default)

Conventions (explain conventions used)
- $variableName $ sign indicates that the obj has been wrapped by function and its functionality has been extended/altered in some ways.

.jscsrc .eslintrc
- has defaults, only really necessary if your viewing build in editor.
- if you have these files in your site root, will use those instead.

Breaking from convention
- @todo list
- e.g. no dev dependencies.

Env vs config
- explain how to do this and the differences.
