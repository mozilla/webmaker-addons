define(function(require) {
  var PNGExport = require("src/png-export");

  return {
    handlePngDragOver: function(e) {
      for (var i = 0; i < e.dataTransfer.types.length; i++) {
        if (e.dataTransfer.types[i] == 'Files') {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          return;
        }
      }
    },
    handlePngDrop: function(e) {
      var file = e.dataTransfer.files[0];
      var reader = new FileReader();

      if (!(file && file.type == 'image/png')) return;

      e.stopPropagation();
      e.preventDefault();
      reader.onload = this.handleLoadDroppedPNG;
      reader.readAsArrayBuffer(file);
    },
    handleLoadDroppedPNG: function(e) {
      var items = PNGExport.extractItemsFromPNG(e.target.result);
      if (!items) return;
      this.handleImportItemsFromPNG(items);
    }
  };
});
