# Status

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
