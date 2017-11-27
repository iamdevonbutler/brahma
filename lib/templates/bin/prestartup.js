#!/usr/bin/env node

// Lifecycle: prestartup.
// In `prestartup`, we define the necessary data required for the `startup` stage.

process.env.LIFECYCLE = 'startup';
process.env.APP_NAME = '{{appName}}';
process.env.PORT = {{port}};

require('./startup')();
