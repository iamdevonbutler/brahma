const self = module.exports;

self.loadConfig = (src) => {
  const config = require(src);
  // itterate over config item.
  // if a item is attached to the startup lifecycle, change config value
};

self.getConfig = () => {
  // We should be able to easily list tbe ENV
  // HTTP server should return config.
};

// config and env and all that.
// there is config that never changes
// there is config that changes dep on env.
// there is config that changes for other reasons.
// there is config that once changed requires a server restart.
// there is config that once changed does not require a server restart.
// we should define lifecycles for the server. different states. and config and
// perhaps other stuff. prestartup, startup, run, shutdown.
// there is also config across apps in addtion to config across environments.
// THERE NEEDS TO BE A UPDATE LIVE CONFIG FEATURE also a deploy assets function too.
