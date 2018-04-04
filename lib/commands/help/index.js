const {EOL} = require('os');
const chalk = require('chalk');
const objectAssign = require('js-object-assign');

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
    var metaHelp, commandHelp;
    // Return top level commands if commandName is not provided.
    if (!commandName) {
      metaHelp = metaCommands.filter((item, key) => key.split('.').length === 1);
      commandHelp = commands.filter((item, key) => key.split('.').length === 1);
    }
    else {
      commandHelp = commands.get(commandName);
      if (commandHelp) {
        return {[commandName]: commandHelp};
      }
      else {
        metaHelp = metaCommands.filter((item, key) => {
          return key.startsWith(commandName) && key.split('.').length - 1 === commandName.split('.').length;
        });
        commandHelp = commands.filter((item, key) => {
          return key.startsWith(commandName) && key.split('.').length - 1 === commandName.split('.').length;
        });
      }
    }

    helpObj = objectAssign(commandHelp, metaHelp);

    return helpObj;
  },
  main({self, cli, input, breadcrumbs, metaCommands, commands}) {
    var helpObj, helpStr, commandName, verbose = false, relativeRoot;

    commandName = input && input._ && input._.length > 1 ? input._.slice(1) : null; // slice because "help" is in pos 0.
    relativeRoot = breadcrumbs.join('.') || null;

    verbose = input ? !!input.verbose : false;

    if (commandName) {
      // convert [item.name] into [item, name]
      commandName = commandName.reduce((p, c) => {
        return p.concat(c.split('.'));
      }, []);
      if (commandName.length > 1) {
        // @todo idt we shouldf be changing the relative root. might be causing display bugs.
        // relativeRoot = relativeRoot ? relativeRoot + '.' + commandName.slice(0, -1).join('.') : null;
        commandName  = relativeRoot ? relativeRoot  + '.' + commandName.slice(-1).join('.') : commandName.join('.');
      }
      else {
        commandName = relativeRoot ? relativeRoot + '.' + commandName[0] : commandName[0];
      }
    }
    else {
      commandName = relativeRoot;
    }

    helpObj = self.getHelpObj(commandName);
    helpStr = self.formatHelpObj({helpObj, verbose, relativeRoot});

    cli.write(helpStr);
  }
};
