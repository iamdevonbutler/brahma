const path = require('path');
const shell = require('shelljs');
const {
  getObjFromDirectory,
} = require('../../utils');
const {writeServerFile} = require('./lib');

module.exports = config => (args, cb) => {
  var resources, microservicesList;

  const resourcesPath = path.join(process.cwd(), 'resources');
  const buildPath = path.join(process.cwd(), 'build');
  const locations = new Set();

  // Init shell (@todo this may be redundant).
  shell.cd(process.cwd());

  // clean build dir.
  shell.exec(`rm -rf ./build`);
  shell.exec(`mkdir ./build`);

  // Get resources.
  resources = getObjFromDirectory(resourcesPath);

  // Get a list of microservices.
  microservicesList = Object.keys(config);

  // For each microservice.
  microservicesList.forEach(appName => {
    shell.cd(buildPath);
    shell.exec(`mkdir ${appName}`);
    shell.cd(path.join(buildPath, appName));
    // shell.exec(`cp -R ../../app/* ./.`);

  });


  // For each microservice:
  // write dir to /build/[dirName]
  // and in each microserivce directory:
  // write ./server.js
  // write ./package.json
  // write ./brahma.app.config.js
  // wirte ./config/
  // write ./utils/
  // write ./middleware/
  // write ./decorators/
  // write ./resources/
  // write ./services/
  // write static assets to ./static/
  // write editor config files to ./. like .eslintrc
  // install dependencies

  // for (let item of resources) {
  //   const {name, resource} = item;
  //   const {location} = resource;
  //   if (locations.has(location)) {
  //     // @todo
  //   }
  //   else {
  //     if (config.apps[location])  {
  //       locations.add(location)
  //       createDirectorySync(path.join(process.cwd(), 'build', location));
  //     }
  //     else {
  //       return console.error(`location "${location}" not defined in brahma.config.js`);
  //     }
  //   }
  // }




  var server;

  if (config.https) {
    const key = readFileSync(path.join(__dirname, '/config/cert/key.pem'));
    const cert = readFileSync(path.join(__dirname, '/config/cert/cert.pem'));
    server = https.createServer({key, cert}, app.callback()).listen(PORT, async () => {
      const port = server.address().port;
      logger.info({port, https: true}, 'app.startup.listen');
      messages.push(`-> HTTPS server listening on port "${port}"`);
      messages.push(`-> Calling resource.init() callbacks.`);
      await callResourceCallback($resources, 'init');
      await callAppInitCallback($resources);
      console.log(messages.join(EOL));
    });
  }
  else {
    server = http.createServer(app.callback()).listen(PORT, async () => {
      const port = server.address().port;
      logger.info({port, http: true}, 'app.startup.listen');
      messages.push(`-> HTTP server listening on port "${port}"`);
      messages.push(`-> Calling resource init() callbacks.`);
      await callResourceCallback($resources, 'init');
      await callAppInitCallback($resources);
      console.log(messages.join(EOL));
    });
  }


  // Adding a resource
    // Include dependencies.

  // After all resources are added to apps it's time to execute the integrations
  // e.g. documentation addon, cron, rabbit communication thing 0

  // const resources = new ResourceCollection();
  // resources.forEach
  // resources.get()
  // resources.get('resource.name')
  // resources.add()
  // resources.update()
  // resources.remove()
  cb();
};
