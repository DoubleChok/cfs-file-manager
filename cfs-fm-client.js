_.extend(FileManager, {
  getTopLevelTemplate: function () {
    var view = Blaze.getView( $("#cfsFileManager")[0] );
    return view._templateInstance;
  },
  visibleManager: null,
  hide: function () {
    var visibleManager = this.visibleManager;
    if ( visibleManager )
      Blaze.remove(visibleManager);
  },
  launch: function (collection, opts, callback) {
    check(collection, FS.Collection);
    check(opts, Match.Optional(Object));
    check(callback, Function);

    const dataObject = {
      collection,
      opts,
      callback
    };

    this.visibleManager = Blaze.renderWithData(Template.cfsFileManager, dataObject, this.getWrapperElem());
  },
  getWrapperElem: function () {
    return $(this.wrapperElem || "body")[0];
  }
});

_.extend(FileManagerGroup.prototype, {
  generatePath: function () {
    let pathString = this.name;

    function addParentToPath(node) {
      if ( !node.parentGroupId )
        return;

      var parent = node.getParentGroup({fields: {name: 1, parentGroupId: 1}});
      pathString = parent.name + " > " + pathString;
      addParentToPath(parent);
    }
    addParentToPath(this);
    return pathString;

  }
});
