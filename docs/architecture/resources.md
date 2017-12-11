# Resources


## Rules
- A resource is a ALWAYS a JS Object.
- A resource NEVER uses `this`
- A resource ALWAYS uses `ctx` and `$ctx` in place of `this`.
- `ctx` and `$ctx` are provided to ALL resource methods via dependency injection.

- `name` field. resources and other code can encapsulate what they want to be called. increases flexibility, u can now do whatever w/ files and shit will still work.

export?


Resource structure
- resources do not have a strictly defined folder structure (structure here, at scale, can lead to disorganization) but there are some rules.
- provide conventions for how to organize folders tho. @todo reference repos.

Resource properties
- cache?
- name
- type (@see resource types)
- active
- test
  - unit
  - system
- restrict
- docs
- args
- require
- pre
- post
- main

- export? @todo how to do loading - define folder structure.
* a big thing w/ neo is extending functionality - so there can be more properties. @todo provide examples of extending a resource e.g. "cron" integration.

Resource types
- endpoint
- test
- decorator
- middleware
- service
- static asset? (can be a resource if its an obj w/ a assetPath field)
- callback? can have callback types like hooks.

Endpoint properties
- ...resourceProperties
- location
- http
- method
- start
- stop
- decorators

Test properties
- ...resourceProperties
- location
