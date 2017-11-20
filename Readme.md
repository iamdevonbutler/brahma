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

Terminology?
resources are made up of ???? modules?

Rabbit is abstracted away but can be used manually

Philosophy
- unix philosophy, do 1 thing, and decorate to do more. u want lots of little modules.
- each root folder e.g. /addons /apps /resources should have a singluar root purpose
  - e.g. apps, config and customization for servers
  - e.g. dbs, config for dbs
  - e.g. resources, application code for servers
- no `this` (especially w/ function decoration)
- as above so below
