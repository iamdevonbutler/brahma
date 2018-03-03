const node_ssh = require('node-ssh');
const ssh = new node_ssh();

module.exports = ({apps, settings, env, activeEnv, variables}) => async (args) => {

  ssh.connect({
    host: 'localhost',
    username: 'jay',
    privateKey: '/Users/jay/.ssh/id_rsa'
  });


  return true;
};
