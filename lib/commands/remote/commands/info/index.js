// test installing scoped packages.
module.exports = {
  name: 'info',
  alias: 'i',
  description: 'request info from remote servers',
  examples: [
    'remote info [env]',
  ],
  main({data, cli, commands}) {
    if (!data) {
      commands.get('remote.env').main.call(null);
    }
  },
};
