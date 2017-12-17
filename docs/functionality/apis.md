# APIs

## Brahma core APIs
- `resources`
- `static assets`
- `dependencies`



`utils` a resource. how does this work. what if users want their own utils. maybe they just replace methods. idk.
- `load()`
- `read()`
- `readStream()`

API
- load // load loads resources
  - load.private()
  - load.resource()
  - load.config()
  - load.merge(path, {data})
  - clear require cache param?
- readStream
- read  // read reads data
  - read.static();
  - read.private('', true);
- env
  - env.get()
  - env.set()
- variables
  - variables.get()

Convention
- all reads via read are async?

---

@todo
