module.exports = configPath => {
  var globals, config, apps, obj = {};
  config = {
    http: true,
    https: false,
    redis: false,
    lcache: false,
    mcache: false,
    static: false,
    lockdown: false,
    ratelimiter: false,
    cors: false,
    injectables: null,
    integrations: null,
    env: null,
    ...require(configPath),
  };
  if (!config.apps) {
    throw 'Add property "apps" to your brahma.config.js (config.apps = {})';
  }
  apps = {...config.apps};
  delete config.apps;
  for (let appName in apps) {
    let app = apps[appName];
    if (!app.port) throw `Add property "port" to you brahma.config.js for app "${app}"`;
    obj[appName] = {
      ...config,
      ...app,
    };
  }
  return obj;
};
