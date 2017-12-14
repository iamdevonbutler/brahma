## brahma `ssh`

Allows you to ssh into a remote app.

## Usage

So you can do pretty much anything to a remote box w/ ssh and root access. Having all that power at your fingertips can be most dangerous. Remote server config/deployment/updates can all be managed w/ well tested programatic scripts (see @todo deploy and update) so the use of SSH is generally not recommended. There are, however, plenty of legitimate use cases for SSH access, hence its support in Brahma.

## Setup
Configure your remote.js config file:
```javascript
// ./config/remote.js
module.exports = ({env, private}) => ({
  // @todo
});

```
For more on managing `private` data, view [/docs/functionality/privacy](@todo).

## Example

```
$brahma ssh [appName] [environment]
```
