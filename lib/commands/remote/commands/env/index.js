// @todo will probably need config injected.
module.exports = {
  name: 'env',
  description: 'list remote environments',
  examples: [
    'remote env',
  ],
  main({cli}) {
    // cli.write('@todo');
    return 'this is the env';
  },
};
