const {fork} = require('child_process');
const path = require('path');
const {EOL} = require('os');

const swig = require('swig');
const {writeFile, writeFileSync} = require('fs');
const {removeSync, ensureDirSync, copy} = require('fs-extra');
const stringify = require('stringify-object');
const {directoryExists, fileExists} = require('../../utils');

const resourcesPath = path.join(process.cwd(), 'resources');
const boilerplatePath = path.join(__dirname, 'app');
const buildPath = path.join(process.cwd(), 'build');

const {
  getObjFromDirectory,
} = require('../../utils');

const self = module.exports;

function Copy(inCwd, outCwd, promises) {
  return (from, to, recursive = false) => {
    from = path.join(inCwd, from);
    to = path.join(outCwd, to);
    var promise = new Promise((resolve, reject) => {
      copy(from, to, err => err ? reject(err) : resolve());
    });
    promises.push(promise);
    return promise;
  };
};

function templateFile(filename, data) {
  var template, output;
  template = swig.compileFile(filename);
  output = template(data);
  return output;
};

function WriteAndTemplate(inCwd, outCwd, appName, promises = [], encoding = 'utf8') {
  return (fileInName, fileOutName, data, synchronous = false) => {
    var file = templateFile(path.join(inCwd, fileInName), data);
    var src = path.join(outCwd, appName, fileOutName);
    if (synchronous) return writeFileSync(src, file, {encoding});
    var promise = new Promise((resolve, reject) => {
      writeFile(src, file, {encoding}, err => err ? reject(err) : resolve());
    });
    promises.push(promise);
    return promise;
  };
};

function filterAppConfig(obj) {
  const {http, https, redis, lcache, mcache, lockdown, ratelimiter, mongorules, cors, injectables, signedCookies, basicAuth, decorators} = obj;
  return {
    https,
    http,
    redis,
    lcache,
    mcache,
    lockdown,
    ratelimiter,
    mongorules,
    cors,
    injectables,
    signedCookies,
    basicAuth,
    decorators,
  };
};

// format for package.json.
function formatDependencies(obj = {}) {
  var keys, items = [], str;
  keys = Object.keys(obj);
  keys.forEach(key => {
    items.push(`"${key}": "${obj[key]}"`);
  });
  str = items.join(`,${EOL}\t\t`);
  return str;
};

self.main = ({apps, settings, env, activeEnv, variables}) => async ({options}) => {
  var resources, microservicesList, promises;

  // clean build dir.
  removeSync(buildPath);
  ensureDirSync(buildPath);

  // Get resources.
  // @todo we need to do something w/ resources, middleware, decorators.
  // resources = getObjFromDirectory(resourcesPath);

  // Get a list of microservices.
  microservicesList = Object.keys(apps);

  // For each microservice.
  promises = microservicesList.map(appName => {
    var appConfig, write, copyBoilerplate, copyFromProject, writePromises = [], errors = [];

    const appRoot = path.join(path.join(buildPath, appName));
    appConfig = filterAppConfig(apps[appName]);
    write = WriteAndTemplate(boilerplatePath, buildPath, appName, writePromises);
    copyBoilerplate = Copy(boilerplatePath, appRoot, writePromises);
    copyFromProject = Copy(process.cwd(), appRoot, writePromises);

    // ./build/[appName]
    ensureDirSync(path.join(appRoot));

    // ./build/[appName]/bin
    ensureDirSync(path.join(appRoot, 'bin'));

    // ./build/[appName]/lib
    ensureDirSync(path.join(appRoot, 'lib'));

    // ./build/[appName]/static
    var staticAssetsPath = path.join(process.cwd(), 'static');
    if (directoryExists(staticAssetsPath)) {
      copyFromProject('static', './.');
    }


    // ./build/[appName]/lib/bootstrap/**
    copyBoilerplate('lib/bootstrap', 'lib/bootstrap', true);

    // ./build/[appName]/lib/middleware/**
    copyBoilerplate('lib/middleware', 'lib/middleware', true);

    // ./build/[appName]/lib/services/**
    copyBoilerplate('lib/services', 'lib/services', true);

    // ./build/[appName]/lib/utils/**
    copyBoilerplate('lib/utils', 'lib/utils', true);

    // ./build/[appName]/lib/decorators/**
    copyBoilerplate('lib/decorators', 'lib/decorators', true);

    // ./build/[appName]/package.json
    write('./package.json', './package.json', {
      name: appName,
      version: apps[appName].version || '0.1.0',
      description: apps[appName].description || '',
      nodeVersion: settings.nodeVersion,
      dependencies: formatDependencies(apps[appName].dependencies),
    }, true); // synchronous write - needs to be there to install dependencies.

    // ./build/[appName]/.eslintrc
    var eslintrcPath = path.join(process.cwd(), '.eslintrc');
    if (fileExists(eslintrcPath)) {
      copyFromProject('./.eslintrc', './.eslintrc');
    }
    else {
      write('./.eslintrc', './.eslintrc');
    }

    // ./build/[appName]/.jscsrc
    var jscsrcPath = path.join(process.cwd(), '.jscsrc');
    if (fileExists(jscsrcPath)) {
      copyFromProject('./.jscsrc', './.jscsrc');
    }
    else {
      write('./.jscsrc', './.jscsrc');
    }

    // ./build/[appName]/Readme.md
    write('./Readme.md', './Readme.md', {appName});

    // ./build/[appName]/brahma.app.js
    var data = stringify(appConfig);
    write('./brahma.app.js', './brahma.app.js', {data});


    // ./build/[appName]/bin/start.js
    write('./bin/start.js', './bin/start.js');

    // ./build/[appName]/bin/stop.js
    write('./bin/stop.js', './bin/stop.js');

    // ./build/[appName]/bin/install.js
    write('./bin/install.js', './bin/install.js', {appRoot}, true);


    // ./build/[appName]/lib/server.js
    write('./lib/server.js', './lib/server.js', appConfig);

    // ./build/[appName]/lib/connections.js
    write('./lib/connections.js', './lib/connections.js');


    // npm install ./build/[appName]
    return new Promise((resolve) => {
      var env = {...process.env, NODE_ENV: activeEnv};
      if (options.verbose) env.VERBOSE = 'true';
      var child = fork(path.join(appRoot, 'bin/install.js'), [], {env});
      child.on('exit', async () => {
        var obj = Object.keys(apps[appName].dependencies || {});
        obj.forEach(dependency => {
          var npmModulePath = path.join(appRoot, 'node_modules', dependency);
          if (!directoryExists(npmModulePath)) {
            let error = `"${dependency}" not installed (apps.${appName}.dependencies.${dependency})`;
            errors.push(error);
          }
        });
        await Promise.all(writePromises);
        resolve({
          info: errors.length ? null : [`Built app "${appName}"`],
          errors: errors.length ? errors : null,
        });
      });
    }); // end promise.

  }); // end map.

  return new Promise(async (resolve) => {
    var result = await Promise.all(promises);
    var {info, errors} = result.reduce((p, c) => {
      if (c.info) p.info = p.info.concat(c.info);
      if (c.errors) p.errors = p.errors.concat(c.errors);
      return p;
    }, {info: [], errors: []});
    info = info.length ? info : null;
    errors = errors.length ? errors : null;
    resolve({info, errors});
  });
};
