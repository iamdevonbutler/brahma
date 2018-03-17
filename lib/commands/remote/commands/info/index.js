// test installing scoped packages.
module.exports = {
  name: 'info',
  alias: 'i',
  description: 'request info from remote servers',
  examples: [
    'remote info [env]',
  ],
  main({input, cli, commands}) {
    var result = commands.get('remote.env').main(null);
    console.log('remote.info:', result);
  },
};
