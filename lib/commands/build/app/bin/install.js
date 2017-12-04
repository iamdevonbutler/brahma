const {exec} = require('child_process');

process.chdir('{{src}}');

exec('npm install {{src}}', (error, stdout, stderr) => {
  process.exit();
});
