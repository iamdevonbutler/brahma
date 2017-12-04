module.exports = (config, appName) => {
  var errors = [];
  const {lockdown, decorators, mongorules, cors, signedCookies, basicAuth} = config;
  if (lockdown) {
    if (!lockdown.whitelist) errors.push(`Missing property "whitelist" (apps.${appName}.lockdown).`);
    if (!isType(lockdown.whitelist, 'array')) errors.push(`Invalid type. Property needs an "Array" (apps.${appName}.lockdown.whitelist).`);
  }
  if (decorators) {
    if (!isType(decorators, 'array')) errors.push(`Invalid type. Property needs an "Array" (apps.${appName}.decorators).`);
  }
  if (mongorules) {
    const {defaultConnectionName, defaultDatabaseName} = mongorules;
    if (!defaultConnectionName) errors.push(`Missing property "defaultConnectionName" (apps.${appName}.mongorules).`);
    if (!defaultDatabaseName) errors.push(`Missing property "defaultDatabaseName" (apps.${appName}.mongorules).`);
  }
  if (cors) {
    const {whitelist} = cors;
    if (!whitelist || !whitelist.length) errors.push(`Missing property "whitelist" (apps.${appName}.cors).`);
  }
  if (signedCookies) {
    const {keys} = signedCookies;
    if (!keys || !keys.length) errors.push(`Missing property "keys" (apps.${appName}.signedCookies).`);
  }
  if (basicAuth) {
    const {name, password} = basicAuth;
    if (!name || !password) errors.push(`Missing properties "name" and "password" (apps.${appName}.basicAuth).`);
  }
  return errors.length ? errors : null;
};
