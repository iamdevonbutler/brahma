const self = module.exports;

module.exports = {
  name: 'helpers',
  description: 'automate common tasks w/ helper commands',
  examples: [
    'helpers exampleHelper [arg1, arg2]'
  ],
  hooks: {
    // info: // @todo
    status: [
      {name: 'status command name', main() {}}
    ]
  }
};
