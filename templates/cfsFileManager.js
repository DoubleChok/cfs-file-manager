Template.cfsFileManager.created = function () {
  this.selectedNode = new ReactiveVar();
  this.mode = new ReactiveVar("find");
  this.fileObj = new ReactiveVar();
  this.previewUrl = new ReactiveVar();
  this.previewItem = new ReactiveVar();
};

Template.cfsFileManager.rendered = function () {
  //when the sub loads, click the first file group
  var timer = Meteor.setInterval( () => {
    var $handle = this.$(".file-group-handle")
    if ( $handle.length > 0 ) {
      Meteor.clearInterval(timer);
      $handle.first().trigger('click');
    }
  }, 100);
},

FileManager.Templates.FileManagerTemp = {
  generatePreview: function (tmpl, file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      tmpl.previewUrl.set( e.target.result );
    }
    reader.readAsDataURL(file);
  },
  helpers: {
    previewItem: function () {
      var fileObj = Template.instance().fileObj.get();
      if ( fileObj )
        return fileObj;

      return Template.instance().selectedNode.get();
    },
    isFile: function () {
      return this instanceof FS.File;
    },
    mode: function () {
      return Template.instance().mode.get();
    },
    fileObj: function () {
      return Template.instance().fileObj.get();
    },
    imgPreviewUrl: function () {
      if ( this instanceof FS.File && this.url() )
        return this.url();

      return Template.instance().previewUrl.get();
    },
    getPath: function () {
      let pathString = null;
      let parent = null;
      if ( this instanceof FS.File ) {
        pathString = this.name();
        parent = FileManagerGroups.findOne({_id: this.fileGroupId}) ||
          Template.instance().selectedNode.get();

      } else {
        pathString = this.name;
        parent = this.getParentGroup();
      }
      if ( !parent )
        return pathString;

      pathString = parent.generatePath() + " > " + pathString;
      return pathString;
    }
  },
  events: {
    "click .fork-group": function (e, tmpl) {
      e.preventDefault();
      let newName = prompt("What is this folder called?", "New folder");
      if ( !newName )
        return;

      var newGroup = this.fork(newName);
      tmpl.selectedNode.set(newGroup);
    },
    "click .change-name": function (e, tmpl) {
      e.preventDefault();
      let newName = null;

      //handle folder rename
      if ( this instanceof FileManagerGroup ) {
        newName = prompt("Enter the new name", this.name);
        if ( !newName )
          return;

        this.name = newName;
        var result = FileManagerGroups.update(this._id, {$set: {name: newName}});
        if ( result !== 1 ) {
          alert("Error");
        } else {
          tmpl.selectedNode.set(this);
        }

        //handle file rename
      } else if ( this instanceof FS.File ) {
        newName = prompt("Enter the new name", this.name());
        if ( !newName )
          return;

        //file must have an extension in the name. if not we'll get errors
        const oldExtension = this.extension();
        if ( !_.contains(newName, "." + oldExtension) ) {
          newName += `.${oldExtension}`;
        }
        this.name(newName);
        var result = this.collection.update(this._id, {$set: {"original.name": newName}});
        if ( result !== 1 ) {
          alert("Error");
        } else {
          tmpl.fileObj.set(this);
        }

      }
    },
    "click .cancel": function () {
      FileManager.hide();
    },
    "click .select-file": function (e, tmpl) {
      e.preventDefault();
      const file = tmpl.fileObj.get();
      const cb = tmpl.data.callback;
      cb(null, file);
    },
    "click .save-file-now": function (e, tmpl) {
      e.preventDefault();

      let file = tmpl.fileObj.get();
      if ( !file ) {
        alert("Please select a file to upload");
        return;
      }

      const targetGroup = tmpl.selectedNode.get();

      if ( !targetGroup || _.isEmpty(targetGroup) ) {
        alert("Please select a folder.");
        return;
      }

      if ( targetGroup instanceof FS.File ) {
        alert("Must select a folder, not a file.");
        return;
      }

      file.fileGroupId = targetGroup._id;
      file.name( tmpl.$(".save-file-name").val() || file.name() );

      const opts = tmpl.data.opts;
      if ( opts ) {
        FS.Utility.extend(file, opts);
      }

      const cb = tmpl.data.callback;
      const collection = tmpl.data.collection;

      collection.insert(file, cb);
    },
    "click .toggle-mode": function (e, tmpl) {
      e.preventDefault();
      var mode = $(e.target).data('mode');
      var existingMode = tmpl.mode.get();
      if ( mode === existingMode )
        return;

      //if changing from find to insert, make sure file obj is wiped
      //it's possible that they will have selected a file before chaging
      //we don't want them to try to reupload a file that's already there
      if ( mode === "insert" ) {
        tmpl.fileObj.set(null);
      }
      tmpl.mode.set(mode);
    },
    'click .show-select-file': function (e, tmpl) {
      tmpl.$("#cfs-fm-file-input").click();
    },
    "change #cfs-fm-file-input": function (e, tmpl) {
      var rawFile = e.currentTarget.files[0];

      if ( !rawFile )
        return;

      FileManager
        .Templates
        .FileManagerTemp
        .generatePreview(tmpl, rawFile);

      var file = new FS.File(rawFile);
      tmpl.fileObj.set(file);
      tmpl.previewItem.set(file);
    }
  }
};

Template.cfsFileManager.helpers(FileManager.Templates.FileManagerTemp.helpers);
Template.cfsFileManager.events(FileManager.Templates.FileManagerTemp.events);
