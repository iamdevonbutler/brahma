# Deploy

## Plugins

### brahma-deploy-vultr

Required config:
- SSH key(s)
- user name

OS
- Ubuntu 17.10 x64

Default VPS
- $5/month, 1 CPU, 1024 MB memory, 1 TB bandwidth (upgradeable)

Securtiy configuration
- SSH login w/ password disabled.
- created user has `sudo` access.

Process management
- upstart

Server config

@todo

Add ssh key to vultr. config option somewhere.

thinking about ditiching flightplan and using the ssh2 module.

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
