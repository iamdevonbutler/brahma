# brahma `remote`

## Commands
```
$brahma remote list
$brahma remote add [--environment=]
$brahma remote remove
$brahma remote update [--hold] [--checkout=]
$brahma remote checkout [--version=]
$brahma remote scale --appName= --environment= --count=
$brahma remote cycle --appName= --environment= --count=

$brahma remote stop
$brahma remote start
$brahma remote restart
```

### `remote list`
Lists all remote environments.

### `remote add`
Adds a remote environment.


how would u deploy your documentation site to s3 and everything else to vultr.

ok so u could update once.
make code changes, add a new worker Lworker, then want to update again
update needs to create a new server.

what if u wanna add a node
what if u wanna remove a node
what if u wanna to upgrade boxes
need to store server data somewhere but if multiple people doing deploys at the same time
how to redirect http and messaging traffic after an update
- add a node
- remove a node
- upgrade a box
- downgrade a box

store
- env ip appName clusterIndex

brahma.lock {
  remote0: [
    {ip: '333.21.2.3.0', appName: 'router', instanceId: 'sadfsfas', hostingId: '', state: 'active' },
    {ip: '333.21.2.3.1', appName: 'router', instanceId: 'sadasdfd', hostingId: '', state: 'active' },
    {ip: '333.21.2.3.2', appName: 'worker', instanceId: 'adfssdff', hostingId: '', state: 'active' },
  ],
  remote1: {

  }
}





Options
- `[--environment=]` - env name

If you run `add` w/o any args, it will add every environment in your `env.js` config.

### `remote remove`
Removes a remote environment.

Options
- `--environment=` - env name

### `remote start`
Starts a stopped environment.

### `remote stop`
Stops all apps running in the remove environment, while keeping the servers running. To stop the underlying servers run `remote remove ENV`.

### `remote restart`
Calls `remote stop` and then `remote start`.



what to do if u add/remove a server.









## Helper integration
- adds a helper to list vultr plans.


## Plugins
- [brahma-remote-vultr](@todo)

Required config:
- SSH key(s)
- user name

OS
- Ubuntu 16.04 x64 (default)

Default VPS
- $5/month, 1 CPU, 1024 MB memory, 1 TB bandwidth (upgradeable)

Securtiy configuration
- SSH login w/ password disabled.
- created user has `sudo` access.

Process management
- upstart

Server config

@todo

deploy should return info about servers so users can login and easily configure them e.g. resize router load balancer.

private data?

Info
https://www.youtube.com/watch?v=kR06NoSzAXY - lets encrypt.
https://www.youtube.com/watch?v=BJZZnhGtR4A&t=322s - upstart
https://jream.com/blog/post/time-saving-digital-ocean-vultr-startup-script - vultr startup scripts
https://www.youtube.com/watch?v=FJrs0Ar9asY - nginx (load balancer, static cache)
https://www.nginx.com/blog/mitigating-ddos-attacks-with-nginx-and-nginx-plus/ - nginx
https://mail.google.com/mail/u/0/#inbox/16055558c5b6abd7

add multiple ssh keys to server

pre/post deploy hooks - call a func before and after running deploy shit.

Add ssh key to vultr. config option somewhere.

vultr package takes a snapshot. make sure that workflow exists.

ddos nginx.

take server offline every X - see heroku docs,

https://www.vultr.com/docs/securing-ssh-on-ubuntu-14-04 2014 (old)
https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-16-04

- adduser username (questions follow)
- usermod -aG sudo userName
- mkdir ~/.ssh
- chmod 700 ~/.ssh
- touch ~/.ssh/authorize_keys
- chmod 600 ~/.ssh/authorize_keys
- edit /etc/ssh/sshd_config (may need sudo)
  - PermitRootLogin no
  - PasswordAuthentication no (prevents brute force attacks)
- sudo stytemctl reload sshd

- you can install node via a curl command

ufw - ssh firewall

// theres a lot of install shit that i should let the user configure like
the version of node that's downlaoded and i could let them update a config but
ide rather have them impertiavely update the server code.

## Domains
talk about how to set up ur domains. we dont do auto shit cuz u like never have to do this.
https://github.com/iwantmyname/iwmn-js helper integration



vultur
- status: makes sure ssh access works and that we have a valid api key.


`deploy`
- cycle server feature - command to refresh server like heroku does automatically.
- gotta be able to add custom nginx configs.
- upstart
- there is separate `deploy` and `update` functionality. deploy deploys server boilerplate that u dont update. update is how u update that boilerplate.
- ideally you just run deploy, you see the manifest (whhats going to happen), you agree, and then shit happens.
  - deploy everything or select items?
    - big con w/ deploying items is you can fuck up. e.g. if u deploy a version of the config that is out of date w/ live code.
    - but sometimes u have edited your resources locally, but that shit aint ready for prod and all u wanna do is update your config e.g. change the name of something.
    - could mitigate this if ur resources requested config as its own prop, so we know what config items our prod code needs.
- ci server? see "breaking from convention - ci server"
- for selecting items to deploy: do one of those yeoman style option list things where you select what u wanna deploy (config, env,)
- if deploying a single app to multiple boxes, deploy 2 1 box first, make sure shit works, then deploy the rest, or clone the boxes.
- neo servers are deployed, they register global cli commands, which we are gonna hit w/ ssh. make sure we check the path to be sure the bin exists OR run a status command and if it doesnt work say 'hey check ur path'.
- if dep/plugin versions are not fixed, we fix, install updated deps, run tests, then ask if the user wants to deploy. make it a rule, dont deploy non fixed versions.
- services
  - mongo free tier - https://www.mongodb.com/cloud/atlas/lp/general
  - redis free tier - https://redislabs.com/pricing/redis-cloud/
  - image cdn

@note
the server config is tested on "Ubuntu 16" - and although the OS version can be changed, do so at your own risk.

make a commit hash - make sure we cant' update when everything is up to date.

@todo want a way to checkout a different versions of the site, u should be able to upload a new version but not have it take effect until u manually check it out. so u can put up commits for site maintaince

todo - terminal progress when doing adding a remote. log the steps its doing then show progress.
