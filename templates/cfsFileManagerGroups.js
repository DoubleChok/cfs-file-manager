Template.cfsFileManagerFileGroups.created = function () {
  this.openGroupIds = new ReactiveVar([]);
  Tracker.autorun( () => {
    var openIds = this.openGroupIds.get();
    this.subscribe('cfsFileManagerGroupChildren', openIds);
  });
};

var cfsFileManagerTemplate = {
  events: {
    'click .file-group-handle': function (e, tmpl) {
      e.preventDefault();
      var openIdList = tmpl.openGroupIds.get();
      var index = openIdList.indexOf(this._id);
      var topLevel = FileManager.getTopLevelTemplate();

      //if it's a new item, add to list of open Ids
      if ( index === -1 ) {
        openIdList.push(this._id);
      } else {
        //if closing, remove from list
        openIdList.splice(index, 1);

        //also remove all children
        function removeChildren (node) {
          FileManagerGroups.find({parentGroupId: node._id}).forEach(c => {
            if ( _.contains(openIdList, c._id ) ) {
              var idx = openIdList.indexOf(c._id);
              openIdList.splice(idx, 1);
              removeChildren(c);
            }
          });
        }
        removeChildren(this);
      }
      //set as selected
      topLevel.selectedNode.set(this);
      //reset
      tmpl.openGroupIds.set(openIdList);

      //if mode is insert, fileobj is always preview. if not, folder becomes preview again
      if ( topLevel.mode.get() !== 'insert') {
        console.log('here')
        topLevel.fileObj.set(null);
      }
    }
  },
  helpers: {
    fileGroups: function () {
      if ( this._id ) {
        return FileManagerGroups.find({
          parentGroupId: this._id
        }, {
          sort: {
            name: 1
          }
        });
      } else {
        return FileManagerGroups.find({
          parentGroupId: null
        });
      }
    },
    hasChildren: function () {
      var groupChildren = FileManagerGroups.find({
        parentGroupId: this._id
      });
      if ( groupChildren.count() > 0 )
        return true;

      var fileChildren = this.getChildFiles();
      return fileChildren.length > 0;
    },
    isOpen: function () {
      var openList = Template.instance().openGroupIds.get();
      return _.contains(openList, this._id);
    }
  }
};


Template.cfsFileManagerFileGroups.events(cfsFileManagerTemplate.events);
Template.cfsFileManagerFileGroups.helpers(cfsFileManagerTemplate.helpers);
