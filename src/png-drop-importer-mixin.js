define(function(require) {
  var PNGExport = require("src/png-export");

  return {
    handleDragOver: function(e) {
      for (var i = 0; i < e.dataTransfer.types.length; i++) {
        if (e.dataTransfer.types[i] == 'Files') {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          return;
        }
      }
    },
    handleDrop: function(e) {
      e.stopPropagation();
      e.preventDefault();

      var file = e.dataTransfer.files[0];
      var reader = new FileReader();

      if (file.type != 'image/png') return;

      reader.onload = this.handleLoadDroppedPNG;
      reader.readAsArrayBuffer(file);
    },
    handleLoadDroppedPNG: function(e) {
      var items = PNGExport.extractItemsFromPNG(e.target.result);
      if (!items) return;
      this.handleImportItemsFromPNG(items);
    },
    componentDidMount: function() {
      var node = this.getDOMNode();
      node.addEventListener('dragover', this.handleDragOver);
      node.addEventListener('drop', this.handleDrop);
    },
    componentWillUnmount: function() {
      var node = this.getDOMNode();
      node.removeEventListener('dragover', this.handleDragOver);
      node.removeEventListener('drop', this.handleDrop);
    }
  };
});
