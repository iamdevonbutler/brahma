const {EOL} = require('os');
const objectAssign = require('js-object-assign');
const chalk = require('chalk');

module.exports = {
  name: 'help',
  alias: 'h',
  description: 'print help information',
  examples: [
    'help [command]',
  ],
  formatHelpText({helpObj, verbose = false, commands, breadcrumbs}) {
    var keys, str = '';
    keys = Object.keys(helpObj);
    keys.forEach((key, i) => {
      var isCommand, item, alias, name;
      isCommand = commands ? !!commands.get(key) : false;
      item = helpObj[key];
      alias = item.alias ? ' ' + item.alias : '';
      if (breadcrumbs && breadcrumbs.length) {
        let str = breadcrumbs.join('.');
        name = item.name.startsWith(str) ? item.name.slice(str.length + 1) : item.name; // + 1 to remove the dot prefix.
      }
      else {
        name = item.name;
      }
      if (i > 0) str += EOL; // if u do this at bottom, u will have an extra line.
      str += '    ' + (isCommand ? chalk.green(name) : name) + (isCommand ? chalk.green(alias) : alias);
      str += EOL;
      str += '    -> ' + item.description;
      str += EOL;
      if (verbose && item.examples) {
        let examples = [].concat(item.examples);
        examples.forEach(example => str += '       ' + example + EOL);
      }
      if (verbose && item.notes) {
        let notes = [].concat(item.notes);
        notes.forEach(note => str += '    ** ' + note + EOL);
      }
    });
    return `  Commands:${EOL}${EOL}${str}`;
  },
  getHelpObj({commandName, commands, metaCommands}) {
    var metaHelp, commandsHelp;
    // Return top level commands if commandName is not provided.
    if (!commandName) {
      metaHelp = metaCommands.filter((item, key) => key.split('.').length === 1, true);
      commandsHelp = commands.filter((item, key) => key.split('.').length === 1, true);
    }
    else {
      // Find a command's help.
      metaHelp = metaCommands.filter((item, key) => {
        return key.startsWith(commandName) && key.split('.').length - 1 === commandName.split('.').length;
      }, true);
      commandsHelp = commands.filter((item, key) => {
        return key.startsWith(commandName) && key.split('.').length - 1 === commandName.split('.').length;
      }, true);
    }

    // Create a wrapped helpObj.
    helpObj = commandsHelp.assign(metaHelp);

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
    helpStr = self.formatHelpText({helpObj, verbose, commands, breadcrumbs});
    cli.write(helpStr);
  }
};
