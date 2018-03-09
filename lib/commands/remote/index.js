// test installing scoped packages.
module.exports = {
  name: 'remote',
  alias: 'i',
  description: 'manage remote servers',
  notes: 'To install private repos, you must add them manually in "./config/dependencies.js"',
  examples: [
    'install npmPackageName',
    'install @scope/npmPackageName',
    'install npmPackageName@version',
    'install githubUsername/repoName',
    'install githubUsername/repoName@version',
  ],
};
