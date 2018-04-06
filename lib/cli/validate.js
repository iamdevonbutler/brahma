module.exports = (...commands) => {
  var err = [], obj = [];
  commands.forEach(commands1 => {
    commands1.forEach(command => {
      if (command.indexOf('.') > -1) {
        err.push(`Invalid syntax. Command names cannot contain "." (${command})`);
      }
      if (obj.indexOf(command) > -1) {
        err.push(`Duplicate key (command)`);
      }
      obj.push(command);
    });
  });
  return err.length ? err : null;
};
