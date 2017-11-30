const path = require('path');
const mongorules = require('mongorules');
const {getDirectoriesSync, fileExists} = require('../utils');
const {connectToMongodb} = require('../connections');
const {MONGODB_URL} = process.env;

module.exports = async ({resourcesPath, config, shutdownApp}) => {
  const {defaultConnectionName, defaultDatabaseName, connections, databases} = config;

  // Init connections.
  for (let item of connections) {
    const {name, url = MONGODB_URL, options = {}} = item;
    const connection = await connectToMongodb({
      name,
      url,
      options,
      shutdownApp,
    });
    // @todo log if connecttomongo doesnt.
    mongorules.addConnection(item.name, connection);
  }

  // Init databases.
  databases.forEach(item => mongorules.addDatabase(item.connectionName, item.name));

  // Set default db.
  mongorules.setDefaultDb(defaultConnectionName, defaultDatabaseName);

  // Load models.
  const directories = getDirectoriesSync(resourcesPath);
  directories.forEach(directory => {
    const schemaPath = path.join(resourcesPath, directory, '/lib/schema.js');
    const methodsPath = path.join(resourcesPath, directory, '/lib/methods.js');
    const onErrorPath = path.join(resourcesPath, directory, '/lib/onError.js');

    const schema = fileExists(schemaPath) ? require(schemaPath) : null;
    if (!schema) return;

    const connectionName = schema.connectionName || defaultConnectionName;
    const databaseName = schema.databaseName || defaultDatabaseName;

    const methods = fileExists(methodsPath) ? require(methodsPath) : null;
    const onError = fileExists(onErrorPath) ? require(onErrorPath) : null;

    const {Types} = mongorules;
    mongorules.addModel(connectionName, databaseName, directory, {
      schema: schema.call(null, Types),
      methods,
      onError,
    });


  });
};
