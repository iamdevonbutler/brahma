## Architectural goals
- speed. - fast local server reloads during dev (< X sec). Fast updates to remote (< X sec).
- status driven development
- security. - if you can implent a higher level of security w/o incuring tradeoffs then you should do it.
- zero server config.
- zero downtime downtime deployments.
- instant deployments.
- one repo per project regardless of #apps
- properly opinionated - opinionated to enforce best pratices and continunity, while not copping out and enforcing structure when it compromises developer flexibility as a means to cut down on development time.
- communicate w/ other parts of app. e.g. some apps have route callbacks that don't have easy ways to call the handler of a another route callback w/o making an http request.
