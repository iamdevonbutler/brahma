# Server

The Brahma server.

infinity server.

apps have modes.
- testing
- running
- updating
- ....
* mode.onChange

lifecycle states
- startup
- run
- shutdown
* lifecycle.onChange

app status
app update (resources, tests, dependencies, assets, config, apps, )
app start
app stop
app restart
app checkout

how to update node_modules while live
- could update pack.j -> run npm i -> clear require cache;
- big problem. npm is super unreliable and debugging its logs on remote systems sucks.
- so let's ship dependencies from our local to prod...
  - post deploy file checksum - do a recursive grep of remote files and compare concatenated file strings and also add up the file size.
  - post deploy run tests on the remote machine
- ./neo
  - ./dependencies
    - ./@todo
      - ./node_modules
      - ./public
  - ./lib
  - ./bin
- will need to set NODE_PATH='yourdir'/node_modules
- will still need to clear the require cache

/update
/update/dependencies
/update/resources

/update/config

/update/dbs/[dbName]/[add/remove/update/[custom]]
/update/decorators/[decoratorName]/[add/remove/update]
/update/docs?
/update/integrations?
/update/middleware/[name]/[add/remove/update]
/update/services
/update/utils

/update/startup
/update/shutdown

---

// const resources = new ResourceCollection();
// resources.forEach
// resources.get()
// resources.get('resource.name')
// resources.add()
// resources.update()
// resources.remove()
or keep it functional...
