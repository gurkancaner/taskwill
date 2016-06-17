Package.describe({
  name: 'gurkancaner:authorization',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.use('accounts-password');
  api.use('check');
  api.use('mongo');
  api.use('tracker', 'client');
  api.use('templating', 'client');
  api.use('underscore');

  api.mainModule('role.js');

  api.addFiles([
    "server/authorization.js",
    "permissions.js",
  ], 'server');
  api.addFiles([
    "client/authorization.js",
  ], 'client');

  api.export("Role");
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('gurkancaner:authorization');
  api.mainModule('authorization-tests.js');
});
