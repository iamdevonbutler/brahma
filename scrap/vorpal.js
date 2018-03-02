// Register commands w/ vorpal.
mainPrompt
  .command('status [command]')
  .autocomplete(status.autocompleteOptions().map(item => chalk.magenta(item)))
  .help(async (args) => {
    var str = '';
    str = mainPrompt._commandHelp('status');
    str += `${EOL}  Command List:${EOL}`;
    str += status.autocompleteOptions(false).map(item => `   - ${item}`).join(EOL);
    str += EOL;
    console.log(str);
    return mainPrompt.show(); // @note idk if there's a way to modify help w/o this return.
  })
  .action(async args => {
    var {errors, info} = await status.main(state)(args);
    if (info) logArray(info);
    if (errors) logArray(errors, true);
    return errors;
  });

mainPrompt
  .command('build')
  .option('-v, --verbose', '[optional]')
  .action(async args => {
    args.options = {
      verbose: false,
      ...args.options,
    };
    const startTime = Date.now();
    var {info, errors} = await status.main(state)(args);
    if (errors) {
      console.log('Status errors:');
      logArray(errors, true);
    }
    else {
      var {info, errors} = await build.main(state)(args);
      if (info) logArray(info);
      if (errors) logArray(errors, true);
      console.log(`-> Build time (${Date.now() - startTime}ms)`);
    }
    return errors;
  });

mainPrompt
  .command('deploy')
  .action(async args => {
    var {info, errors} = await build.main(state)(args);
    if (errors) {
      console.log('Build errors:');
      logArray(errors, true);
    }
    else {
      var {info, errors} = await deploy(state)(args);
      if (info) logArray(info);
      if (errors) logArray(errors, true);
    }
    return errors;
  });

mainPrompt
  .command('serve')
  .action(async args => {
    var {info, errors} = await build.main(state)(args);
    if (errors) {
      console.log('Build errors:');
      logArray(errors, true);
    }
    else {
      var {info, errors} = await serve(state)(args);
      if (info) logArray(info);
      if (errors) logArray(errors, true);
    }
    return errors;
  });

mainPrompt
  .command('helpers')
  .action(async args => {
    var {info, errors} = await helpers.main(state)(args);
    if (errors) {
      console.log('Helpers errors:');
      logArray(errors, true);
    }
    return errors;
  });

// Display vorpal in terminal.
mainPrompt
  .delimiter(state.settings.delimiter)
  .show()
  .exec('help');
