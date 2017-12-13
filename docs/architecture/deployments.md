# Deployments

Brahma "deployments" differ significantly from "updates":

## brahma `deploy`
- Configures remote server:
  - Installs OS
  - Creates a new remote user w/ `sudo` privileges
  - Configures SSH access for new user
  - Disables login via password
  - Disables login via root
  - Configures "upstart" for auto server restarts
  - Configures firewall @todo
  - Optionally installs "Let's Encrypt" for auto renew SSL
- Transfers (via "SSH") static files to remote hosts:
  - server boilerplate
  - dependencies
  - static assets

## brahma `update`
- Runs `status` locally, which runs `tests` locally (among other checks).
- Transfer "resources" and "config" (from memory) to deployed and running remote apps.
- Remote apps rapidly integrate "resources" and "config" w/o necessitating a server restart.
