const {exec} = require('child_process');

process.chdir('{{appRoot}}'); // @note needed for npm i to work correctly. idtk why tho.

exec('npm install {{appRoot}}', (error, stdout, stderr) => {
  process.exit();
});
