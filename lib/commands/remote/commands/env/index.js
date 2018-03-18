// @todo will probably need config injected.
module.exports = {
  name: 'env',
  description: 'list remote environments',
  examples: [
    'remote env',
  ],
  main({cli}) {
    return 'this is the env';
  },
};
