const {exec} = require('child_process');

process.chdir('{{appRoot}}');

exec('npm install {{appRoot}}', (error, stdout, stderr) => {
  process.exit();
});
