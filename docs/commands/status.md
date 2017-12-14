## brahma `status`


## Flags
- --runSystemTests

## Status driven development
@todo

@todos
Rails has a nice post update codebase terminal output (https://youtu.be/GY7Ps8fqGdc?t=593)
Status runs before most Brahma commands.

Brahma's architecture allows us to validate our app in its entierty prior to `build`, `deploy`, `update`, and `serve`. As consequence, our built apps are without most validation checks. We do run tests post build to ensure consistency of environments...

Privacy
- hook into status, uses static analyssi tool, check .gitignore to make sure private is included.

## Commands
- `validateProcessEnv` - ensures you access `config` via the "[config API](@todo)"


`status`
- shows u what libraries/middleware/decorators you have, if u have installed packages like middlewear-essentials u wont know exactly what u have installed.
- make sure no one is using require or import statements.
- if you are using any of the http properties make sure the location has http enabled.
- `brahma status resources`
  - validate resources - calls validate functions defined by integrations and your local tests.
  - use static analysis plugin to validate and prevent the use of `this`.
- `brahma status resource RESOURCE_NAME`
  - resource has a location property. its value is a registered app. (if not, log all errors so people can fix all at once)
- `brahma status routes`
  - list routes by each resource - resourceName|route
- `brahma status routes ROUTE`
  - returns matching the resource.
  - 2 flags. one flag to match '/users/:id' and another to match '/user/122'. --exact -e
  - @todo how to handle routes that have multiple matches. i think koa-router (which we should
  mention we are using in the docs) hits all matched enodpoints but i could be wrong. keep
  in mind, the order in which we load routes is unknown to the user.
- `brahma status require`
  - brahma status require resource.name|service.name|middleware.name|decorator.name|...
  - tells u what is requiring the resource, and what the resource is requiring.
- `brahma status services|decorator|middleware|utils`
  - lists all services|decorator|middleware|utils
  - runs tests. services are npm modules which should be tested on their own.
  but what about custom services?
  - maybe list what's requiring them too (redundant but OK)
- `brahma status config`
  - runs basic validation for each config. our validation and integration validation for their config (thinking about seprating configs from integrations, so integrations dont fuck w/ the apps.js file)
  - makes sure you dont have conflicting ports when env === settings.localEnvironment.
- `brahma status dependencies`
  - makes sure dependencies were installed correctly ('npm i' worked).
  - lists dependencies and their versions (useful for debugging remote servers)
