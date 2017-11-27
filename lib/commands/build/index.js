const path = require('path');
const shell = require('shelljs');
const swig = require('swig');
const {writeFileSync} = require('fs');

const {
  getObjFromDirectory,
} = require('../../utils');

function templateFile(filename, data) {
  var template, output;
  template = swig.compileFile(filename);
  output = template(data);
  return output;
};

function writeFile(fileInName, fileOutName, data) {
  var file, fileIn, fileOut;
  fileIn = path.resolve(__dirname, '../../templates', fileInName);
  fileOut = path.resolve(process.cwd(), 'build', appName, fileOutName);
  file = templateFile(fileIn, data);
  writeFileSync(fileOut, file, {encoding: 'utf8'});
};

module.exports = config => (args, cb) => {
  var resources, microservicesList;

  const resourcesPath = path.join(process.cwd(), 'resources');
  const buildPath = path.join(process.cwd(), 'build');
  const environment = args.options.environment || 'development';

  // Init shell (@todo this may be redundant).
  shell.cd(process.cwd());

  // clean build dir.
  shell.exec(`rm -rf ./build`);
  shell.exec(`mkdir ./build`);

    // ./build/brahma.app.js
  // var appJSFile, appJSInPath, appJSOutPath;
  // appJSInPath = path.resolve(__dirname, '../../templates', 'brahma.app.js');
  // appJSOutPath = path.resolve(process.cwd(), 'build', 'brahma.app.js');
  // appJSFile = templateFile(appJSInPath, {environment, appName});
  // writeFileSync(appJSOutPath, appJSFile, {encoding: 'utf8'});

  // Get resources.
  resources = getObjFromDirectory(resourcesPath);

  // Get a list of microservices.
  microservicesList = Object.keys(config);

  // For each microservice.
  microservicesList.forEach(appName => {
    var appPath = path.join(buildPath, appName);
    const {port} = config[appName];
    
    // ./build/[appName]
    shell.cd(buildPath);
    shell.exec(`mkdir ${appName}`);

    // ./build/[appName]/bin
    shell.cd(appPath);
    shell.exec(`mkdir ./bin`);

    // ./build/[appName]/bin/prestartup.js
    writeFile('./bin/prestartup.js', './bin/prestartup.js', {appName, port});

    // ./build/[appName]/bin/startup.js
    writeFile('./bin/startup.js', './bin/startup.js', config[appName]);

    // ./build/[appName]/bin/shutdown.js
    writeFile('./bin/shutdown.js', './bin/shutdown.js', config[appName]);

    // ./build/[appName]/server.js
    writeFile('server.js', 'server.js', config[appName]);

    // ./build/package.json
    writeFile('package.json', 'package.json', config[appName]);


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

  return;
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