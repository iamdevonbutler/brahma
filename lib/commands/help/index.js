const objectAssign = require('js-object-assign');

module.exports = {
  name: 'help',
  description: 'print help information',
  examples: [
    'help [command]',
  ],
  main({cli, data, metaCommands, commands}) {
    var metaHelp, commandsHelp, helpObj, helpStr, commandName;

    commandName = data._[0];
    if (!commandName) {
      // Find the top level commands.
      metaHelp = metaCommands.filter((item, key) => key.split('.').length === 1);
      commandsHelp = commands.filter((item, key) => key.split('.').length === 1);
    }
    else {
      // Find a command's help.
      metaHelp = metaCommands.filter((item, key) => key.startsWith(commandName) && key.length > commandName.length);
      commandsHelp = commands.filter((item, key) => key.startsWith(commandName) && key.length > commandName.length);
    }

    helpObj = objectAssign(metaHelp, commandsHelp);

    helpStr = cli.formatHelpText(helpObj);
    // cli.eol();
    cli.write(helpStr);
  }
};
