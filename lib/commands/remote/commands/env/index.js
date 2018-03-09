// test installing scoped packages.
module.exports = {
  name: 'env',
  description: 'list remote environments',
  examples: [
    'remote env',
  ],
  main({cli}) {
    cli.write('@todo'); // @todo will probably need config injected.
  },
};
