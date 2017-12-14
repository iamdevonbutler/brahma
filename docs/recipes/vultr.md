# Vultr

[Vultr](https://www.vultr.com) is a hosting company that provides [very inexpensive](https://www.vultr.com/pricing) VPSs and a ["Node API"](https://github.com/DeviaVir/node-vultr) to interface w/ them.

This doc is intended to get you up and running on Vultr:

## 1) Create account and/or login
Here's the [create account link](https://www.vultr.com/register).

## 2) Add the Vultr "API key" to your "deploy.js" config
The `brahma-deploy-vultur` plugin uses the `npm` package [node-vultr](https://github.com/DeviaVir/node-vultr) to programatically communicate w/ Vultr. This allows us to deploy our Brahma servers to remote hosts, run custom startup scripts and config, and do much much more.

[Copy the API key from Vultr](https://my.vultr.com/settings/#settingsapi) and add it to your `./config/deploy.js` config:
```javascript
module.exports = {
  remoteName: {

  }
};
```

## 3) Add SSH key(s)
We need to upload our public SSH key to Vultr to enable [SSH access](@todo ssh.md) on our remote servers. All team members who need SSH access MUST provide Vultr w/ their public key.

If you don't have a SSH key, and your on "Mac", open up the terminal and run:
```
ssh-keygen -t rsa -C "Your Name <youremail@example.com>"
```

Now copy your public key (on "Mac" it lives here: `~/.ssh/id_rsa.pub`):
```
cat ~/.ssh/id_rsa.pub | pbcopy
```

Next, [upload your key to Vultr](https://my.vultr.com/sshkeys/).

**Protip:** the `brahma-deploy-vultr` "plugin" registers a few helpers for managing SSH keys w/ Vultur:

```
$brahma helper addSSHKeyVultr <pathname>
$brahma helper removeSSHKey <id>
$brahma helper listSSHKeys
```
