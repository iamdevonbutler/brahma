# Interoperable JS

Brahma makes use of the npm package [JSMoves](https://github.com/iamdevonbutler/jsmoves) (created for Brahma). JSMoves allows you to `.encode()` and `.decode()` JS so that it can be passed among computers and reintegrated into live programs.

Here's how it's used in Brahma:

You're developing locally and want to go live. You run `brahma deploy` to move your app servers to remote hosts (`deploy` first runs `status`, then `build`). This automatically configures the server, uploads app boilerplate, and uploads necessary dependencies and static assets.

Your "resources" are next. But we DON'T transfer the static files that comprise our "resources"; rather, we load the resources into memory, run some preprocessing to normalize their interfaces, and using "JSMoves" we "encode" them locally, transfer them and "decode" them on our remote where they are integrated into our live app. This allows us to preform super fast updates, creating a environment where we can develop locally and update remotely nearly instantaneously.
