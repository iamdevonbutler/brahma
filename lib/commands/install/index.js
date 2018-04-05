// test installing scoped packages.
module.exports = {
  name: 'install',
  description: 'install packages from NPM and GitHub',
  notes: [
    'To install private repos, you must add them manually in "./config/dependencies.js"',
  ],
  examples: [
    'install npmPackageName',
    'install @scope/npmPackageName',
    'install npmPackageName@version',
    'install githubUsername/repoName',
    'install githubUsername/repoName@version',
  ],
  main({cli}) {
    cli.write('test install');
  }
};
