const {fork} = require('child_process');
const path = require('path');
const shell = require('shelljs');
const swig = require('swig');
const {writeFileSync} = require('fs');
const stringify = require('stringify-object');
const {directoryExists, fileExists} = require('../../utils');

const resourcesPath = path.join(process.cwd(), 'resources');
const boilerplatePath = path.join(__dirname, 'app');
const buildPath = path.join(process.cwd(), 'build');

const {
  getObjFromDirectory,
} = require('../../utils');

// @note temp function
function templateFile(filename, data) {
  var template, output;
  template = swig.compileFile(filename);
  output = template(data);
  return output;
};

// @note - not a pure function.
// @note temp function
function writeFile(fileInName, fileOutName, appName, data, encoding = 'utf8') {
  var file, fileInPath, fileOutPath;
  fileInPath = path.join(boilerplatePath, fileInName);
  fileOutPath = path.join(buildPath, appName, fileOutName);
  file = templateFile(fileInPath, data);
  writeFileSync(fileOutPath, file, {encoding});
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

module.exports = ({config, settings, env, variables}) => async (args) => {
  var resources, microservicesList, promises;

  // Init shell.
  shell.cd(process.cwd());

  // clean build dir.
  shell.exec(`rm -rf ./build`);
  shell.exec(`mkdir ./build`);

  // Get resources.
  // @todo we need to do something w/ resources, middleware, decorators.
  resources = getObjFromDirectory(resourcesPath);

  // Get a list of microservices.
  microservicesList = Object.keys(config);

  // For each microservice.
  promises = microservicesList.map(appName => {
    var errors = [];

    const appRoot = path.join(path.join(buildPath, appName));

    // ./build/[appName]
    shell.exec(`mkdir ${path.join(appRoot)}`);

    // ./build/[appName]/bin
    shell.exec(`mkdir ${path.join(appRoot, 'bin')}`);

    // ./build/[appName]/static
    var staticAssetsPath = path.join(process.cwd(), 'static');
    if (directoryExists(staticAssetsPath)) {
      shell.exec(`cp -r ${staticAssetsPath} ${path.join(appRoot, '/.')}`);
    }

    // ./build/[appName]/lib
    shell.exec(`mkdir ${path.join(appRoot, 'lib')}`);


    // ./build/[appName]/lib/bootstrap/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/bootstrap')} ${path.join(appRoot, 'lib/.')}`);

    // ./build/[appName]/lib/config/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/config')} ${path.join(appRoot, 'lib/.')}`);

    // ./build/[appName]/lib/middleware/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/middleware')} ${path.join(appRoot, 'lib/.')}`);

    // ./build/[appName]/lib/services/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/services')} ${path.join(appRoot, 'lib/.')}`);

    // ./build/[appName]/lib/utils/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/utils')} ${path.join(appRoot, 'lib/.')}`);

    // ./build/[appName]/lib/decorators/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/decorators')} ${path.join(appRoot, 'lib/.')}`);

    // ./build/[appName]/lib/resources/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/resources')} ${path.join(appRoot, 'lib/.')}`);


    // ./build/[appName]/package.json
    writeFile('./package.json', './package.json', appName, {
      name: appName,
      version: config[appName].version || '0.1.0',
      description: config[appName].description || '',
      nodeVersion: settings.nodeVersion,
      dependencies: formatDependencies(config[appName].dependencies),
    });

    // ./build/[appName]/.eslintrc
    var eslintrcPath = path.join(process.cwd(), '.eslintrc');
    if (fileExists(eslintrcPath)) {
      shell.exec(`cp ${eslintrcPath} ${path.join(appRoot, '/.')}`);
    }
    else {
      writeFile('./.eslintrc', './.eslintrc', appName);
    }

    // ./build/[appName]/.jscsrc
    var jscsrcPath = path.join(process.cwd(), '.jscsrc');
    if (fileExists(jscsrcPath)) {
      shell.exec(`cp ${jscsrcPath} ${path.join(appRoot, '/.')}`);
    }
    else {
      writeFile('./.jscsrc', './.jscsrc', appName);
    }

    // ./build/[appName]/Readme.md
    writeFile('./Readme.md', './Readme.md', appName, {appName});

    // ./build/[appName]/brahma.app.js
    var data = stringifyAppConfig(config[appName]);
    writeFile('./brahma.app.js', './brahma.app.js', appName, {data});


    // ./build/[appName]/bin/start.js
    writeFile('./bin/start.js', './bin/start.js', appName);

    // ./build/[appName]/bin/stop.js
    writeFile('./bin/stop.js', './bin/stop.js', appName);

    // ./build/[appName]/bin/install.js
    writeFile('./bin/install.js', './bin/install.js', appName, {appRoot});


    // ./build/[appName]/lib/server.js
    writeFile('./lib/server.js', './lib/server.js', appName);

    // ./build/[appName]/lib/connections.js
    writeFile('./lib/connections.js', './lib/connections.js', appName);


    // npm install ./build/[appName]
    return new Promise((resolve) => {
      var child = fork(path.join(appRoot, 'bin/install.js'));
      child.on('exit', () => {
        var obj = Object.keys(config[appName].dependencies || {});
        obj.forEach(dependency => {
          var npmModulePath = path.join(appRoot, 'node_modules', dependency);
          if (!directoryExists(npmModulePath)) {
            let error = `"${dependency}" not installed (apps.${appName}.dependencies.${dependency})`;
            errors.push(error);
          }
        });
        resolve({
          info: !errors.length ? [`Built app "${appName}"`] : null,
          errors: errors.length ? errors : null,
        });
      });
    });
  });

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
