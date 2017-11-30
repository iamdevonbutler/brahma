module.exports = (config, appName) => {
  var errors = [];
  const {lockdown, decorators, mongorules, cors, signedCookies, basicAuth} = config;
  if (lockdown) {
    if (!lockdown.whitelist) errors.push(`"apps.${appName}.lockdown" needs a "whitelist" property (brahma.config.js).`);
    if (!isType(lockdown.whitelist, 'array')) errors.push(`"apps.${appName}.lockdown.whitelist" needs an "Array" (brahma.config.js).`);
  }
  if (decorators) {
    if (!isType(decorators, 'array')) errors.push(`"apps.${appName}.decorators" needs an "Array" (brahma.config.js).`);
  }
  if (mongorules) {
    const {defaultConnectionName, defaultDatabaseName} = mongorules;
    if (!defaultConnectionName) errors.push(`"apps.${appName}.mongorules" needs a "defaultConnectionName" property (brahma.config.js).`);
    if (!defaultDatabaseName) errors.push(`"apps.${appName}.mongorules" needs a "defaultDatabaseName" property (brahma.config.js).`);
  }
  if (cors) {
    const {whitelist} = cors;
    if (!whitelist || !whitelist.length) errors.push(`"apps.${appName}.cors" needs a "whitelist" property w/ at least one item (brahma.config.js).`);
  }
  if (signedCookies) {
    const {keys} = signedCookies;
    if (!keys || !keys.length) errors.push(`"apps.${appName}.signedCookies" needs a "keys" property (brahma.config.js).`);
  }
  if (basicAuth) {
    const {name, password} = basicAuth;
    if (!name || !password) errors.push(`"apps.${appName}.basicAuth" needs a "name" and "password" property (brahma.config.js).`);
  }
  return errors.length ? errors : null;
};
