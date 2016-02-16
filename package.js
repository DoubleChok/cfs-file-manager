Package.describe({
  name: 'dbernhard:cfs-file-manager',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use([
    'ecmascript',
    'underscore',
    'mongo',
    'check',
    'cfs:standard-packages',
    'random',
    'less'
  ]);

  api.use([
    'jquery',
    'templating',
    'livedata',
    'reactive-var',
    'matb33:bootstrap-grid'
  ], 'client');

  api.addFiles('cfs-file-manager.js');
  api.addFiles('server.js', 'server');

  api.addAssets("assets/generic_file_placeholder.png", "client");
  api.addAssets("assets/generic_folder_placeholder.png", "client");

  api.addFiles([
    'cfs-file-manager.less',
    'cfs-fm-client.js',
    'templates/cfsFileManager.html',
    'templates/cfsFileManager.js',
    'templates/cfsFileManagerGroups.html',
    'templates/cfsFileManagerGroups.js',
    'templates/cfsFileManagerFiles.html',
    'templates/cfsFileManagerFiles.js'
  ], "client");

  api.export('FileManager');
  api.export('FileManagerGroups');
  api.export('FileManagerGroup');
});

Package.onTest(function(api) {
  api.use(['ecmascript']);
  api.use('tinytest');
  api.use('dbernhard:cfs-file-manager');
  api.addFiles('cfs-file-manager-tests.js');
});
