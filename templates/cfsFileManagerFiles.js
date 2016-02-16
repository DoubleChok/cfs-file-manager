Template.cfsFileManagerFiles.events({
  "click .file-handle": function (e, tmpl) {
    e.preventDefault();
    //set as selected
    var topLevel = FileManager.getTopLevelTemplate();
    topLevel.fileObj.set(this);
  }
});

Template.cfsFileManagerFiles.helpers({
  files: function () {
    return this.getChildFiles();
  },
  mode: function () {
    var topLevel = FileManager.getTopLevelTemplate();
    return topLevel.mode.get();
  }
});
