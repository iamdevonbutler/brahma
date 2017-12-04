const {exec} = require('child_process');

process.chdir('{{appRoot}}'); // @note needed for npm i to work correctly. idtk why tho.

exec('npm install {{appRoot}}', (err, stdout, stderr) => {
  // console.error(stderr);
  process.exit();
});
