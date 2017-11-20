const {getObjFromDirectory} = toolshed('server.utils.getObjFromDirectory');

function toolshed(key) {
  return require(path.join(process.cwd(), '.toolshed', key));
};

toolshed.globalize();

module.exports = (path) => {
  resources = normalizeResources(getObjFromDirectory(resourcesPath));
  resources = callGlobalResourceDecorators(resources, injectables, config.decorators);
  resources = callLocalResourceDecorators(resources, injectables);
  $resources = decorateResources({resources, injectables});
};
