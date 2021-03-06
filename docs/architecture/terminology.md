# Terminology

Trying to understand new stuff can be tough. So let's start high level, and establish a set of
terms to later apply a lower-level understanding.

Brahma projects can be deconstructed into:
- "resources"
- "static assets"
- "dependencies"

> If you want to find the secrets of the Brahma, think in terms of `resources`, `static assets`, and resource `dependencies` - Thomas Edison

## Resources
This term is deliberately vague as it generally refers to
Resource definition
- @todo
link to resources page.

## Static assets
@todo

## Dependencies
@todo

## Naming changes

To fit Brahma's unique design, some terminology, the way we refer to "stuff", needed adjusting.

This is a list of minor, admittedly pedantic, semantic observations justifying some of Brahma's design decisions:

## "system" tests vs "integration" tests?
So I just made this term up. "System" tests. Maybe it's a thing, but idk.
Yeah, these are called "integration" tests by most. To me, the word integration is far too often overused as an ambigious high-level classification by business people attempting to create the facade that their product or service is superior in some a way that is usually not mentioned.
And i'm just sick of business people trying to blow smoke. So let's be to the point..."system" tests...test a live system - the collection of connected applications produced in `./build`. If you still call them integration test's I wont get mad.

## "hooks" vs "callbacks"
You can hook into ap"Hooks" imply intentionality. When you hook into a system, you do so w/ the intent to extend / modify behavior. Brahma hooks extend the `start()`, `stop()`, `checkout()`, and `update()` behavior (see [hooks](/docs/functionality/hooks)). The word "callback" is more general - it's just code that gets called after something happens. The reason for calling the code back is not implied - it can be anything.

## "args" vs "params"
"Resources" have an "args" property used to define information regarding a function's arguments. That information can be used in documentation, and validation.

The property could be called "params", but JS uses "arguments" and "...args" often, and you rarely see "params"; so ill stay true to tradition here and favor "args" in Brahma.

## "libraries" vs "lib"
Brahma projects have a "libraries" folder - it's where you put custom code that's required by other "resources".

Calling it "lib" would be true to node tradition, but there's much implied meaning about its function. So to avoid confusion and to avoid inheriting the behavioral characteristics of "lib", we use the full name "libraries" to define where we put our custom library code. Its a specificity thing.

## "router" vs "api"
This is just about ambiguity of language. Most projects have a comparatively large server used to handle HTTP requests. It's often called the "api", and it delegates long running synchronous tasks to "worker" servers to keep the thread clear. "api" is a decent word to identify this server - after all, it is a literal interface for other applications, but the semantics of "api" are so general it can be difficult for non-code people to understand EXACTLY what you're talking about ("I thought Twitter was the Api?").

When you think about it, the "api" server is just a big "router". So let's call it just that, the "router".

## "start" and "stop" vs "init" and "shutdown"
"Endpoints" have a `[start()](@todo)` and a `[stop()](@todo)` method called on startup and on shutdown.
@todo
- start and stop are opposites
- init and shutdown aren't so closely related. you wouldn't think, oh looks there's an init() method, there must be an opposing "shutdown" method.

## "remote" vs "deploy"
Deployment is a strategy used by architectures across many languages and frameworks,
it's structure - what it does and how it does it - has sought familiarity with most developers.
When you talk about deployments, yes there are different strategies, but you understand at a high-level what's going on...Let's use git, commit and push our code, have a remote server pull the new code in, and start a new server; but w/ Brahma, moving functionality from your local environment to your remote environment happens nothing like that...Hence we use different terminology to avoid associations w/ conventional deployment strategies. So rather than "deploying" your app, w/ Brahma, you add a "remote" "environment" and then "update" that environment.
