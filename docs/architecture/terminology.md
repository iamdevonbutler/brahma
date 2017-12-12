# Terminology

Trying to understand new stuff can be tough. So let's start high level, and establish a set of
terms to later apply a lower-level understanding.

Brahma projects can be deconstructed into:
- resources
- config
- plugins
- static assets
- dependencies

> If you want to find the secrets of the Brahma, think in terms of `resources`, `config`, `plugins`, `assets`, and resource `dependencies` - Thomas Edison

## Resources
This term is delibertly vague as it generally refers to
Resource definition
- @todo
link to resources page.

## Config

## "system" tests vs "integration" tests?
So I just made this term up. "System" tests. Maybe it's a thing, but idk.
Yeah, these are called "integration" tests by most. To me, the word integration is far too often overused as an ambigious high-level classification by business people attempting to create the facade that their product or service is superior in some a way that is usually not mentioned.
And i'm just sick of business people trying to blow smoke. So let's be to the point..."system" tests...test a live system - the collection of connected applications produced in `./build`. If you still call them integration test's I wont get mad.

## "hooks" vs "callbacks"
You can hook into ap"Hooks" imply intentionality. When you hook into a system, you do so w/ the intent to modify/extend behavior. Brahma hooks extend the `start()`, `stop()`, `checkout()`, and `update()` behavior (see [hooks](/docs/functionality/hooks)). The word "callback" is more general - it's just code that gets called after something happens. The reason for calling the code back is not implied - it can be anything.

## "args" vs "params"
"Resources" have an "args" property used to define information regarding a function's arguments. That information can be used in documentation, and validation.

The property could be called "params", but JS uses "arguments" and "...args" often, and you rarely see "params"; so ill stay true to tradition here and favor "args" in Brahma.

## "lib" vs "libraries"
Brahma projects have a "libraries" folder - it's where you put custom code that's required by other "resources".

Calling it "lib" would be true to node tradition, but there's much implied meaning about its function. So to avoid confusion and to avoid inheriting the behavioral characteristics of "lib", we use the full name "libraries" to define where we put our custom library code. Its a specificity thing.