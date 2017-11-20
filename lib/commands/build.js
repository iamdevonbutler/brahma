const shell = require('shelljs');
const vorpal = require('vorpal')();

module.exports = function(args, cb) {
  // Init shell (@todo this may be redundant).
  shell.cd(process.cwd());

  // clean build dir.
  shell.exec(`rm -rf ./.build`);
  shell.exec(`mkdir ./.build`);

  // Dyanmically attach resources to apps.
  const resources = loadResources(path.join(process.cwd(), 'resources'));
  resources.forEach(resource => {
    // Get location.
    // does app exist?
      // yes, add resource to app
      // no, create app and add resource
  });

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
