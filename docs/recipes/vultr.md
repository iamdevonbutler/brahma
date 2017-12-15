# Vultr

[Vultr](https://www.vultr.com) is a hosting company that provides [very inexpensive](https://www.vultr.com/pricing) VPSs and a [Node API](https://github.com/DeviaVir/node-vultr) to interface w/ them.

This doc is intended to get you up and running on Vultr:

## 1) Create account and/or login
Here's the [create account page](https://www.vultr.com/register) and [login page](https://my.vultr.com).

It is recommended that you create a new Vultr account for each project. The Vultr UI will be less cluttered; but more importantly, shared data, such as "startup scripts" (used by `brahma-remote-vultr`), need to be isolated on a per project basis (e.g. a startup script from an old project will conflict w/ our new project).

## 2) Add the Vultr "API key" to your "remote.js" config
The `brahma-remote-vultur` plugin uses the `npm` package [node-vultr](https://github.com/DeviaVir/node-vultr) to programatically communicate w/ Vultr. This allows us to deploy our Brahma servers to remote hosts, run custom startup scripts and config, and do much much more.

[Copy the API key from Vultr](https://my.vultr.com/settings/#settingsapi) and add it to your `./config/remote.js` config:

```javascript
// ./config/remote.js
module.exports = ({env}) => ({
  vultr: {
    apiKey: '3L3I4OFDRXFMJM3XK4ZNK3X4QDOKWVFERA6Q',
  }
});

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

## 4) Deploy environment
Assuming you have some app boilerplate written, let's deploy our apps remotely. With Brahma we don't deploy our apps individually, we just do it all in one go.

We deploy our apps to a remote "environment" - a collection of distributed remote servers. You might have a "stage" environment and a "production" environment.

By convention, Brahma projects [don't rely on a "testing" environment](@todo ./architecture/testing), as you would have in a "continuous integration" workflow.

If no remote environments exist (they won't yet) we need to first create one - then we can deploy our apps. So let's do that...

Open your terminal and run:
```
$brahma remote add
```

Edit your `./config/remote.js`.
