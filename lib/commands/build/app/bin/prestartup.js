#!/usr/bin/env node

// Lifecycle: prestartup.
// In `prestartup`, we define the necessary data required for the `startup` stage.

process.env.LIFECYCLE = 'startup';
process.env.APP_NAME = '{{appName}}';
process.env.NODE_ENV = '{{nodeEnv}}';
process.env.PORT = {{port}};
process.env.WEB_CONCURRENCY = {{webConcurrency}};

require('./startup')();
