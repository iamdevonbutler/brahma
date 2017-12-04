const {fork, spawn} = require('child_process');
const path = require('path');
const shell = require('shelljs');
const swig = require('swig');
const {writeFile, writeFileSync} = require('fs');
const stringify = require('stringify-object');
const {directoryExists, fileExists} = require('../../utils');

const resourcesPath = path.join(process.cwd(), 'resources');
const boilerplatePath = path.join(__dirname, 'app');
const buildPath = path.join(process.cwd(), 'build');

const {
  getObjFromDirectory,
} = require('../../utils');

function Copy(inCwd, outCwd, promises) {
  return (from, to, recursive = false) => {
    from = path.join(inCwd, from);
    to = path.join(outCwd, to);
    var promise = new Promise((resolve, reject) => {
      var child = shell.exec(`cp ${recursive ? '-r' : ''} ${from} ${to}`, {async: true});
      child.on('exit', err => err ? reject(err) : resolve());
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

// for brahma.app.js.
function stringifyAppConfig(obj) {
  const {http, https, redis, lcache, mcache, lockdown, ratelimiter, mongorules, cors, injectables, signedCookies, basicAuth, decorators} = obj;
  return stringify({
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
  });
};

// format for package.json.
function formatDependencies(obj = {}) {
  var keys, items = [], str;
  keys = Object.keys(obj);
  keys.forEach(key => {
    items.push(`"${key}": "${obj[key]}"`);
  });
  str = items.join(',\n\t\t');
  return str;
};

module.exports = ({config, settings, env, activeEnv, variables}) => async (args) => {
  var resources, microservicesList, promises;

  // Init shell.
  shell.cd(process.cwd());

  // clean build dir.
  shell.exec(`rm -rf ./build`);
  shell.exec(`mkdir ./build`);

  // Get resources.
  // @todo we need to do something w/ resources, middleware, decorators.
  // resources = getObjFromDirectory(resourcesPath);

  // Get a list of microservices.
  microservicesList = Object.keys(config);

  // For each microservice.
  promises = microservicesList.map(appName => {
    var write, writePromises = [], errors = [];

    const appRoot = path.join(path.join(buildPath, appName));
    write = WriteAndTemplate(boilerplatePath, buildPath, appName, writePromises);
    copy = Copy(boilerplatePath, appRoot, writePromises);
    copyFromProject = Copy(process.cwd(), appRoot, writePromises);

    // ./build/[appName]
    shell.exec(`mkdir ${path.join(appRoot)}`);

    // ./build/[appName]/bin
    shell.exec(`mkdir ${path.join(appRoot, 'bin')}`);

    // ./build/[appName]/lib
    shell.exec(`mkdir ${path.join(appRoot, 'lib')}`);

    // ./build/[appName]/static
    var staticAssetsPath = path.join(process.cwd(), 'static');
    if (directoryExists(staticAssetsPath)) {
      copyFromProject('static', './.');
    }


    // ./build/[appName]/lib/bootstrap/**
    copy('lib/bootstrap', 'lib/.', true);

    // ./build/[appName]/lib/middleware/**
    copy('lib/middleware', 'lib/.', true);

    // ./build/[appName]/lib/services/**
    copy('lib/services', 'lib/.', true);

    // ./build/[appName]/lib/utils/**
    copy('lib/utils', 'lib/.', true);

    // ./build/[appName]/lib/decorators/**
    copy('lib/decorators', 'lib/.', true);

    // ./build/[appName]/lib/resources/**
    // shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/resources')} ${path.join(appRoot, 'lib/.')}`, {async: true});

    // ./build/[appName]/package.json
    write('./package.json', './package.json', {
      name: appName,
      version: config[appName].version || '0.1.0',
      description: config[appName].description || '',
      nodeVersion: settings.nodeVersion,
      dependencies: formatDependencies(config[appName].dependencies),
    }, true);

    // ./build/[appName]/.eslintrc
    var eslintrcPath = path.join(process.cwd(), '.eslintrc');
    if (fileExists(eslintrcPath)) {
      copyFromProject('./.eslintrc', './.');
    }
    else {
      write('./.eslintrc', './.eslintrc');
    }

    // ./build/[appName]/.jscsrc
    var jscsrcPath = path.join(process.cwd(), '.jscsrc');
    if (fileExists(jscsrcPath)) {
      copyFromProject('./.jscsrc', './.');
    }
    else {
      write('./.jscsrc', './.jscsrc');
    }

    // ./build/[appName]/Readme.md
    write('./Readme.md', './Readme.md', {appName});

    // ./build/[appName]/brahma.app.js
    var data = stringifyAppConfig(config[appName]);
    write('./brahma.app.js', './brahma.app.js', {data});


    // ./build/[appName]/bin/start.js
    write('./bin/start.js', './bin/start.js');

    // ./build/[appName]/bin/stop.js
    write('./bin/stop.js', './bin/stop.js');

    // ./build/[appName]/bin/install.js
    write('./bin/install.js', './bin/install.js', {appRoot});


    // ./build/[appName]/lib/server.js
    write('./lib/server.js', './lib/server.js');

    // ./build/[appName]/lib/connections.js
    write('./lib/connections.js', './lib/connections.js');


    // npm install ./build/[appName]
    return new Promise((resolve) => {
      var env = {...process.env, NODE_ENV: activeEnv};
      var child = fork(path.join(appRoot, 'bin/install.js'), [], {env});
      child.on('exit', async () => {
        var obj = Object.keys(config[appName].dependencies || {});
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
