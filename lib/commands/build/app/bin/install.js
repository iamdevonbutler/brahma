const {exec} = require('child_process');

process.chdir('{{appRoot}}'); // @note needed for npm i to work correctly. idtk why tho.

exec('npm install {{appRoot}}', (err, stdin, stderr) => {
  // @note process.env.VERBOSE is a string. here we are not handling process.env the brahma way.
  if (process.env.VERBOSE) {
    console.log('\x1b[33m%s\x1b[0m', '-> start "npm install {{appRoot}}" output (err, stdin, stderr):');
    console.log(stdin);
    console.log(err);
    console.log(stderr);
    console.log('\x1b[33m%s\x1b[0m', '-> end "npm install {{appRoot}}" output.');
  }
  process.exit();
});
