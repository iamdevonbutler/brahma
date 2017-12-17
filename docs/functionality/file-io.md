## File IO

How to read and write files using Brahma.

## File storage
There are two types of files of concern here:
- Shared files
- Server files

### Shared files
Most often you will be interfacing w/ files that are intended to be shared among all app instances, e.g. every webserver node, or even, at a higher-level, all apps. Keep in mind, your "remote" environments are
distributed among multiple nodes, with each app having potentially multiple instances of itself, so be careful not to store "shared" data in these local VPS environments.

This distributed architecture calls for a centralized filesystem, and for that, Brahma uses "Amazon S3" - and like all Brahma dependencies, there's a free tier (5 GB, Dec 2017).

#### API
Here's how u setup and interact w/ S3.

### Server files
Server files are stored on your VPS on a per APP INSTANCE basis - referring to, NOT each app, but each server node or app server instance. These files are written to the VPSs SSD, so technically they are persistent, but really, they only exist temporarily. If your server is destroyed,
let's say in the event we downscale remote nodes, so are it's "server files". Hence, convention has it that you store your "server files" in your project's `./tmp` directory.

#### API
So...you can inject the `fs` into your resources and have your way w/ the file system, and if that's whay you need to do, go for it. Brahma provides a simple API that reads, writes, and streams directly to and from your `./tmp` directory.

## Private files
@todo
