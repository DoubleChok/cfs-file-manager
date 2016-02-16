//test data
Meteor.startup(function () {
  if ( !FileManagerGroups.findOne() ) {
    FileManagerGroups.insert({
      name: "Root",
      parentGroupId: null
    });
    console.log("Root file manager group created");
  }
});


_.extend(FileManager, {
    defaultAllow: {
      insert: function () {
        return true
      },
      update: function () {
        return true
      },
      remove: function () {
        return true;
      }
    },
    defaultDeny: {

    },
    Publications: {}
});


FileManager.Publications.fileGroupChildren = function(fileGroupIds = [], opts = {}) {
  check(fileGroupIds, Array);
  check(opts, Match.Optional(Object));

  if ( fileGroupIds.length == 0 ) {
    fileGroupIds.push( null );
  }

  //return all file groups with this parent, and all files in all included collections
  var cursorList = [
    FileManagerGroups.find({
      $or: [
        {_id: {$in: fileGroupIds}},
        {parentGroupId: {$in: fileGroupIds}},
      ]
    }, opts)
  ];

  var includedCollections = FileManager.includedCollections;
  includedCollections.forEach(function (c) {
    cursorList.push(
      c.find({
        "fileGroupId": {
          $exists: true,
          $in: fileGroupIds
        }
      })
    );
  });

  return cursorList;
};

Meteor.publish("cfsFileManagerGroupChildren", FileManager.Publications.fileGroupChildren);
