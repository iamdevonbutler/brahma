const objectAssign = require('js-object-assign');

module.exports = {
  name: 'help',
  description: 'print help information',
  examples: [
    'help [command]',
  ],
  getHelpObj({commandName, commands, metaCommands}) {
    var metaHelp, commandsHelp;
    // Return top level commands if commandName is not provided.
    if (!commandName) {
      metaHelp = metaCommands.filter((item, key) => key.split('.').length === 1);
      commandsHelp = commands.filter((item, key) => key.split('.').length === 1);
    }
    else {
      // Find a command's help.
      metaHelp = metaCommands.filter((item, key) => {
        return key.startsWith(commandName) && key.split('.').length - 1 === commandName.split('.').length;
      });
      commandsHelp = commands.filter((item, key) => {
        return key.startsWith(commandName) && key.split('.').length - 1 === commandName.split('.').length;
      });
    }
    helpObj = objectAssign(metaHelp, commandsHelp);
    return helpObj;
  },
  main({self, cli, input, breadcrumbs, metaCommands, commands}) {
    var helpObj, helpStr, commandName, verbose = false;

    commandName = breadcrumbs.join('.');

    if (input) {
      let suffix = input._.slice(1).join('.'); // slice because "help" is in pos 0.
      commandName += suffix ? '.' + suffix : '';
      verbose = !!input.verbose;
    }

    helpObj = self.getHelpObj({commandName, commands, metaCommands});
    helpStr = cli.formatHelpText(helpObj, verbose);

    cli.write(helpStr);
  }
};
