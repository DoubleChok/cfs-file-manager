# CFS File Manager #

File Manager GUI to accompany cfs suite of meteor packages. Allows users to organize files into a hierarchy, select existing files or upload new ones.

## Installation ##
`meteor add dbernhard:cfs-file-manager`

##Use##

###Setup###
This package creates a new collection called `FileManagerGroups`, and it also needs to know which collections to get files from. To initialize, create a file in your common code that does three things:

First, it needs to tell the package which collections to get files from. Pass an array of Mongo collection instances.

    FileManager.includedCollections = [ Images, Documents, ... ];

Second, we need to tell the package where to render the file manager. Use any css selector.

    FileManager.wrapperElem = "body";

Finally, we need to declare allow/deny rules that control who can update the `FileManagerGroups` collection.

    if ( Meteor.isServer ) {
       FileManagerGroups.allow({
          insert: function () {
            return true;
          },
          update: function () {
            return true;
          },
          remove: function () {
            return true;
        }
      });
    }

You can add deny rules too, if you like. Obviously, the allow/deny rules should match your use case.

###View###
Launch the file manager as follows:

`FileManager.launch(collection, opts, doneCallBack);`

`collection` is the Mongo collection an image will be inserted into.

`opts` is an object that will be appended to file as metadata (`eg, {userId: blah, postId, blahblah ...}`).

`doneCallBack` is a function that takes two arguements: `error` and `fileObject`. It will be called once your user has finished with the file manager. The `fileObject` it returns is an instance of `FS.File`.

All together then, we have something like this:

    FileManager.launch(Images, {userId: '123abc', postId: 'abc123', function (err, fileObject)} {
      if ( err ) {
        alert("Oh snap: your select or upload didn't work");
      } else {
        console.log("You either selected or inserted a file with id ", fileObj._id);
      }
    });

**NB** The file manager will render in the elem you defined above (`FileManager.wrapperElem`). **It's up to you to ensure that this elem exists and that it is visible.**

##To Do##
- Tests
- Improve UX (eg, drag and drop moves, etc)
