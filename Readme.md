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

use the word "distributed" somewhere.

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

List what functionality is modular and what is mandatory.
- e.g. database is modular but message queue is baked in.

Coding standards
- Speak to the importance of keeping code generic and provide examples.
- e.g. how to name function params and variables. make shit recursive because you never know maybe for some other shit you will need a deep version of your function. just look at my utils files and grab a few examples. this would be a good page on a gitbook.

brahma advantages
- you should be able to test remote configuations locally. e.g. test your dev build locally.

Spread the terminology "infinity" server.

I think we should say that these patterns could be the future of node and JS

## Technologies
- i think a list of all the technologies is important for people to get an understanding of what they are dealing w/.
- @todo @end.

## Emerging Themes (maybe this is just important for now and we can express this in another way)
- Interoperable JS
- Infinity servers
- Omniservices


## Potential functionality
I encourage suggestions. What do u want to see brahma do? How should it do it?
Does anyone care about:
- license in app package.json
- other package.json fields for apps.
