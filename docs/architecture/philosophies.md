# Philosophies

## As above so below
The fractal pattern of recurring architecture and design.

Examples:
- plugins (or maybe just app plugins?) inherit the resource architecture of the projects they extend.

## Do it live

> "Fuck it, ill write it and we'll do it live" - TJ Holowaychuk

Most frameworks and utilities are designed to enahnce the local development experience, but do little in the way to extending their capabilities to remote enviornments. Brahma is just as powerful remotely as it is locally.

## Keep your tools DRY

Lot's of comparisons are made between developers and carpenters...really any type of craftsman, or less eloquently, any make of things. Commonalities abound, yet devs could still learn a thing or two from their material counterparts...After a job, carpenters pick up their shit, and leave. They then bring their tools to their next job. They don't go out and buy new tools every time they get a new gig. Us devs can learn a thing or two here. If you have 8 different repos for a project (api, sworker, lworker, cron, smtp, another api server, ...), as you often do when developing microservices, managing common code "is" (not "can be", it "IS") a massive pain in the ass. You have common "utility functions", sometimes hundreds of them, common "libraries" like your custom "SMTP relay" wrapper and your wrapper around your "bunyan logger", lot's of common "middleware" for stuff like forcing HTTPS connections, authentication, and authorization (yes there is a difference), I could go on...but i'm kinda into that brevity thing.

How to manage? You have a few options that all kinda suck; the best among them: abstract common code out into a single or multiple repos that become dependents of each project. I've had a few issues doing this in the past: 1) During local development you will need to `npm link` your projects together, but not w/o issues as `npm link` can be very finicky, 2) updating changes. Say you update a single utility function in your shared "project-utils" repo, you will first need to grep all of your apps to identify dependents, update your code if there's an API change, deploy changes remotely, and keep in mind, you need to do this for every affected repo. It's a lot, and overtime this becomes a huge time sink and a bug vulnerability.

Brahma solves this problem in its entirety. In Brahma projects you write generic code, aka "resources", intended to be shared among various apps. These resources are classified as one of: "endpoints", "decorators", "libraries", "utils", "tests", "middleware" (see @todo). When you run `build`, these resources are organized into the apps which require them (./build/appName). Deployment and updating deploys is super easy w/ Brahma `deploy` and `update`. You can even have multiple versions of resources. e.g. A utility function can have versions 1.x, 2.x, ..., and dependent code can require any version. Now it's important to preserve continunity among apps, but there will always be times when a single app needs to update a resource for a quick fix, and resource versioning makes this happen.
