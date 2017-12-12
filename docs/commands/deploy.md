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
