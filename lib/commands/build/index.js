const path = require('path');
const shell = require('shelljs');
const swig = require('swig');
const {writeFileSync} = require('fs');
const stringify = require('stringify-object');
const {directoryExists} = require('../../utils');
const chalk = require('chalk');

const resourcesPath = path.join(process.cwd(), 'resources');
const boilerplatePath = path.join(__dirname, 'app');
const buildPath = path.join(process.cwd(), 'build');

const {
  getObjFromDirectory,
} = require('../../utils');

// @todos
// install dependencies
  // do package.json first. (dependencies defined)
  //
function templateFile(filename, data) {
  var template, output;
  template = swig.compileFile(filename);
  output = template(data);
  return output;
};

// @note - not a pure function.
function writeFile(fileInName, fileOutName, appName, data, encoding = 'utf8') {
  var file, fileInPath, fileOutPath;
  fileInPath = path.resolve(boilerplatePath, fileInName);
  fileOutPath = path.resolve(buildPath, appName, fileOutName);
  file = templateFile(fileInPath, data);
  writeFileSync(fileOutPath, file, {encoding});
};

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

module.exports = ({config, settings, env, variables}) => async (args) => {
  var resources, microservicesList;

  // Init shell.
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
    var appPath = path.join(buildPath, appName);
    const appConfig = config[appName];
    const {port} = appConfig;


    // ./build/[appName]
    shell.exec(`mkdir ${path.join(buildPath, appName)}`);

    // ./build/[appName]/bin
    shell.exec(`mkdir ${path.join(buildPath, appName, 'bin')}`);

    // ./build/[appName]/static
    var staticAssetsPath = path.join(process.cwd(), 'static');
    if (directoryExists(staticAssetsPath)) {
      shell.exec(`cp -r ${staticAssetsPath} ${path.join(buildPath, appName, '/.')}`);
    }

    // ./build/[appName]/lib
    shell.exec(`mkdir ${path.join(buildPath, appName, 'lib')}`);

    // ./build/[appName]/lib/bootstrap/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/bootstrap')} ${path.join(buildPath, appName, 'lib/.')}`);

    // ./build/[appName]/lib/config/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/config')} ${path.join(buildPath, appName, 'lib/.')}`);

    // ./build/[appName]/lib/middleware/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/middleware')} ${path.join(buildPath, appName, 'lib/.')}`);

    // ./build/[appName]/lib/services/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/services')} ${path.join(buildPath, appName, 'lib/.')}`);

    // ./build/[appName]/lib/utils/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/utils')} ${path.join(buildPath, appName, 'lib/.')}`);

    // ./build/[appName]/lib/decorators/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/decorators')} ${path.join(buildPath, appName, 'lib/.')}`);

    // ./build/[appName]/lib/resources/**
    shell.exec(`cp -r ${path.join(boilerplatePath, 'lib/resources')} ${path.join(buildPath, appName, 'lib/.')}`);


    // ./build/[appName]/package.json
    writeFile('./package.json', './package.json', appName, {
      name: appName,
      version: config[appName].version || '0.1.0',
      description: config[appName].description || '',
      nodeVersion: settings.nodeVersion,
      dependencies: stringify(config[appName].dependencies || {}),
    });

    // ./build/[appName]/.eslintrc
    writeFile('./.eslintrc', './.eslintrc', appName);

    // ./build/[appName]/.gitignore
    writeFile('./.gitignore', './.gitignore', appName);

    // ./build/[appName]/.jscsrc
    writeFile('./.jscsrc', './.jscsrc', appName);

    // ./build/[appName]/.npmrc
    writeFile('./.npmrc', './.npmrc', appName);

    // ./build/[appName]/Readme.md
    writeFile('./Readme.md', './Readme.md', appName);

    // ./build/[appName]/brahma.app.js
    var data = stringifyAppConfig(config[appName]);
    writeFile('./brahma.app.js', './brahma.app.js', appName, {data});


    // ./build/[appName]/bin/start.js
    writeFile('./bin/start.js', './bin/start.js', appName);

    // ./build/[appName]/bin/stop.js
    writeFile('./bin/stop.js', './bin/stop.js', appName);

    // ./build/[appName]/lib/server.js
    writeFile('./lib/server.js', './lib/server.js', appName, {port});

    // ./build/[appName]/lib/connections.js
    writeFile('./lib/connections.js', './lib/connections.js', appName);


    console.log(chalk.green(`Built: "${appName}"`));
  });

  return true;
};
