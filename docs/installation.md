# Installation

If you already have "Node" installed, globally install Brahma via "npm":

```javascript
npm install -g brahma-cli
```
Open a terminal and run `brahma`:

The Brahma command listing should appear. If your terminal errors "command not found", you may need to add Brahma to your $PATH (add /usr/local/bin).

Brahma requires no additional required dependencies.

## Project setup
To create a new project first create a new directory:
```
cd ./newProjectDirectoryPath
mkdir ./newProjectName
```
Launch Brahma:
```
brahma
```
In the interactive shell run the `new` command to write project boilerplate:
```
$brahma new
```
Run brahma `status`
```
$brahma status
```
Status will return a list of todo items - mostly config. Update your config files, then run `status` again. Repeat until `status` no longer yields errors.

Run brahma `serve`:
```
$brahma serve [--watch]
```
`serve` first runs `status`, then `build`, and from the build directory, locally runs your application(s). Append the optional "--watch" flag to enable autoupdating.

## Optional dependencies
- `openssl`: dependency of [`brahma.generate.writeLocalCert`](/docs/commands/generate)
