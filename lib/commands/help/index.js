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
  formatHelpObj({commands}, {helpObj, verbose = false, relativeRoot = null}) {
    var keys, str = '';
    keys = Object.keys(helpObj);
    keys.forEach((key, i) => {
      var isCommand, item, alias, name;
      isCommand = commands ? !!commands.get(key) : false;
      item = helpObj[key];
      alias = item.alias ? ' ' + item.alias : '';
      name = relativeRoot ? item.name.slice(relativeRoot.length + 1) : item.name;
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
  getHelpObj({commands, metaCommands}, commandName) {
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

    // Create a helpObj.
    if (commandsHelp) {
      helpObj = commandsHelp.assign(metaHelp);
    }
    else {
      helpObj = metaHelp;
    }

    return helpObj;
  },
  main({self, cli, input, breadcrumbs, metaCommands, commands}) {
    var command, helpObj, helpStr, commandName, verbose = false, relativeRoot;
    command = input && input._ && input._.length > 1 ? input._.slice(1) : null; // slice because "help" is in pos 0.
    relativeRoot = breadcrumbs.join('.') || null;

    if (command) {
      verbose = !!input.verbose;
      commandName  = relativeRoot ? relativeRoot + '.' + command.join('.') : command.join('.');
      suffix = command.length > 1 ? command.slice(0, -1).join('.') : command.join('.');
      relativeRoot = relativeRoot && suffix ? relativeRoot + '.' + suffix : suffix;
    }
    else {
      commandName = relativeRoot;
    }


    // @todo dont need to DI all thjis stuff. decorate each methods.
    helpObj = self.getHelpObj(commandName);
    helpStr = self.formatHelpObj({helpObj, verbose, relativeRoot});

    cli.write(helpStr);
  }
};
