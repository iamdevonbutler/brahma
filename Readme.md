<p align="center">
  <a data-flickr-embed="true"  href="https://www.flickr.com/photos/generated/20204505852/in/photostream/lightbox/" title="Metatron&#x27;s Cube"><img src="https://farm1.staticflickr.com/426/20204505852_77469d6c4b_z.jpg" width="300" height="300" alt="Metatron&#x27;s Cube"></a>
  <p align="center">An omniservices framework</p>
</p>

# Brahma

The omniservices framework that doesn't give a fuck.

opinonated yet open

dependencies use save-exact = true. update versions w/ updateDependencies helper.
dependiences use yarn, not npm. yarn allows us to install deps in custom directories
needed to update our remotes w/o downtime.
encourage you to use github for project specific non community contrib dependencies.
it's more reliable and easier.
dependencies are resolved locally, download and tested prior to deployments, and rsynced
for reliablitiy and speed.
justify ./config/dependencies.js object value - yes it's more verbose but the syntax for installing
private github packages sucks. brahma is optimized for reliablitiy as to minimize bugs and shit not working.

the goal is to have your local env most closely resemble your remote. OS will be different,
but that should be about it. @todo need a way to sync databases from remote0 to local and
dev servers.

A command line application - given a singular source of ambigious "resources" it creates a integrated collection of NodeJS microservices.

Koa isn't really a framework, it's more of a library. It wraps `req` and `res`, introduces a middleware system, and provides basic helpers to handle things like cookies and serving static assets; but it doesn't provide much frame to work w/ to be classified as a traditional framework.

Brahma is a framework, w/ the benefits of:
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

maintain a single repo vs microservices w/ 5-10 repos.

cron and realtime? for free

Documentation built in.

use the word "distributed" somewhere.

zero downtime deployments.

use the word "opinionated" somewhere.

Terminology?
resources are made up of ???? modules?

env vs variables
- env === dynamic config
- variables === static config

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
- CI baked in. kinda. its better than CI and it solves the same problem.

Spread the terminology "infinity" server.

I think we should say that these patterns could be the future of node and JS


Demonstrate the `config` -> `status` -> `resources` pattern.
- write config. run status. will tell u what shit ur missing. write resources. test. itterate. deploy. itterate.

## Resource types
### Endpoint
### Decorators
- provide good documentation here. use autolog as an example to demonstrate the gotchyas.
- mention that their super powerful and they are the easiest way to fuck shit up.
### Middleware
### Tests
### Services
### Utils
- **Pure functions**


## breaking from convention
- no dev dependencies - intented to make remote builds faster. we are not doing remote builds.
- one of the things we do w/ microservices is create github repos for each service and
sometimes set up hooks to deploy to webservers. lets find a way to not do this w/o tradeoffs...setting up
these private github repos is a bit of work,
- ci server - the server has a tests endpoint that runs our tests in a forked process, and communicates the results. why use another server - its just not as consistent worse?
- process.env uses jsmoves and can be any jsmoves type.
- main.js > index.js
- say something about exporting objects from files w/ a name property and a main property.

## Technologies
- i think a list of all the technologies is important for people to get an understanding of what they are dealing w/.
- @todo @end.

## Emerging Themes (maybe this is just important for now and we can express this in another way)
- Interoperable JS
- Infinity servers
- Omniservices

## Development requirements
- node >= 9
- [openssl] (used by `brahma generate localCert`)

## Potential functionality
I encourage suggestions. What do u want to see brahma do? How should it do it?
Does anyone care about:
- license in app package.json
- other package.json fields for apps.

## Development suggestions
If you are using [atom](https://github.com/atom/atom)...
- [smart-tab-name](https://atom.io/packages/smart-tab-name) will change your tab name from "index.js" to the file's dirname.

## Feature requests
To create a feature request, open an issue, and attach the `feature request` label.

## Community
links to all thinks Brahma.
- [awesome brahma](@todo)

## Support Maya
Maya is the companion project to Brahma. Maya is "the illusion" - a WegGL webapp framework inspired by Brahma. At present, Maya is in need to development resources, aka some free time. To support Maya send me an email at jpescione@gmail.com.

# License
MIT
