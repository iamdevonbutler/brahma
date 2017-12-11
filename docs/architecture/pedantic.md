## Pedantic "loose" conventions.
Loose conventions === "suggestions", rather than "rules".

This is me being a little obsessive, so feel free to ignore these observations.

## "router" vs "api"
This is just about ambiguity of language. Most projects have a comparatively large server used to handle HTTP requests. It's often called the "api", and it delegates long running synchronous tasks to "worker" servers to keep the thread clear. "api" is a decent word to identify this server - after all, it is a literal interface for other applications, but the semantics of "api" are so general it can be difficult for non-code people to understand EXACTLY what you're talking about ("I thought Twitter was the Api?").

When you think about it, the "api" server is just a big "router". So let's call it just that, the "router".

Although seemingly contradictory, the documentation uses "api" in place of "router" to limit the amount of new things new developers need to concern themselves with when learning Brahma.
