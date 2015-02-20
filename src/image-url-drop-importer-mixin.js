define(function(require) {
  var IMG_TYPE = 'application/x-moz-file-promise-url';

  return {
    handleImageUrlDragOver: function(e) {
      for (var i = 0; i < e.dataTransfer.types.length; i++) {
        if (e.dataTransfer.types[i] == IMG_TYPE) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          return;
        }
      }
    },
    handleImageUrlDrop: function(e) {
      e.stopPropagation();
      e.preventDefault();

      var url = e.dataTransfer.getData(IMG_TYPE);
      if (!url) return;
      this.handleLoadDroppedImageUrl(url);
    }
  };
});
