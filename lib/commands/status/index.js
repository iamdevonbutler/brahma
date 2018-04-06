const isType = require('js-type-checking');
const {EOL} = require('os');
const chalk = require('chalk');
const {checkmark, x} = require('../../utils');

// test installing scoped packages.
module.exports = {
  name: 'status',
  printStatus({}, items) {

  },
  status: {
    test() {
      return {err: null, info: 'success'}
    }
  },
  main(obj) {
    var str, errors = 0;
    const {commands, cli} = obj;
    str = EOL + '  Status:' + EOL;
    commands
      .map(command => command.status, true)
      .filter(Boolean, true)
      .filter(item => isType(item, 'object'), true)
      .forEach((item, key, $item) => {
        str += EOL;
        str += '    -> ' + key;
        str += EOL;
        $item.forEach((item1, key1) => {
          if (!isType(item1, 'function')) return;
          let result = item1.call(null, obj);
          if (result.err) {
            errors++;
            str += '       ' + chalk.red(key1 + ': ' + chalk.red(result.err));
          }
          else {
            if (result.info) {
              str += '       ' + chalk.green(key1 + ': ' + result.info);
            }
            else {
              str += '       ' + chalk.green(key1 + ' ' + checkmark());
            }
          }
          str += EOL;
        });
      });

    str += EOL;
    if (errors) {
      str += chalk.red('->  ' + x() + '  ' + errors + ' Errors')
    }
    else {
      str += chalk.green('->  ' + checkmark() + ' OK')
    }
    str += EOL;
    cli.write(str);
  }
};
