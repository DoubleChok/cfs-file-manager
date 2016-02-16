FileManagerGroup = class FileManagerGroup {
  constructor(doc) {
    _.extend(this, doc);
  }

  getParentGroup(opts = {}) {
    return FileManagerGroups.findOne({
      _id: this.parentGroupId
    }, opts);
  }

  getChildGroupsCursor (opts = {}) {
    return FileManagerGroups.find({
      parentGroupId: this._id
    }, opts);
  }

  getChildFiles() {
    var list = [];
    var self = this;
    FileManager.includedCollections.forEach( (c) => {
      c.find({fileGroupId: self._id}).forEach(f => {
        list.push(f);
      });
    });
    return list;
  }

  fork(name) {
    check(name, String);
    let group = new FileManagerGroup({
      name: name,
      parentGroupId: this._id
    });

    group._id = FileManagerGroups.insert(group);
    return group
  }
};


FileManager = {
  includedCollections: [],
  //test only
  Templates: []
};



FileManagerGroups = new Mongo.Collection("cfs_file_manager_groups", {
  transform: (doc) => new FileManagerGroup(doc)
});
