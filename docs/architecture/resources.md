# Resources

Maybe make everything a resource somehow?

## Rules
- A resource is a ALWAYS a JS Object.
- A resource NEVER uses `this`
- A resource ALWAYS uses `ctx` and `$ctx` in place of `this`.
- `ctx` and `$ctx` are provided to ALL resource methods via dependency injection.

- `name` field. resources and other code can encapsulate what they want to be called. increases flexibility, u can now do whatever w/ files and shit will still work.

for each resource, these needs to be a way to look up what properties do what.
so the cron-app, which adds a cron property, needs a way to register w/ the brahma interface,
and define some information about what it needs. information includes valid types, and other stuff.
just figure it out as a i go.



resources can do BOTH:
- export data (objects, arrays, functions, ...)
- contain properties (information) and methods

2 main resource entry points
- main() // resource.call() proxies to main()
- export // resource.export()
- any prop // resource.get('property') if prop is a function, you get a wrapped function that u can call.


init method()
- how would an init method provide injectable data to the other resource methods to be
executed at a later time?

resources should have a "meta" property
- maybe change name, but it needs to include the datatypes of each property for performance,
u dont want to typecheck each property before interacting w/ it.

Resource structure
- resources do not have a strictly defined folder structure (structure here, at scale, can lead to disorganization) but there are some rules.
- provide conventions for how to organize folders tho. @todo reference repos.

Resource properties
- version?
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
- plugin
- util (not dependent on other resources. "resource pure")
- test
- decorator
- middleware
- library
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

Resources entry points
- restful HTTP interface
- response to zmq task
- cron
* since we are wrapping the "handler" and triggering other functions, they should be able to declare the triggers. e.g. you may only want to trigger an action after handler was called from cron and not when it's accessed via http.

---

resources

Apply the interface to each resource, and to the collection of resources? is that necessary.

resources = {
  endpoints: {
    key: {},
  },
  services: {
    key: {},
  },
  decorators: {},
};

resources = createInterface(resources, schema) // depth 1. idk if depth 0 makes sense.
resources.forEach(resource => {});
resources.select('endpoints', 'router').forEach(resource => {});
