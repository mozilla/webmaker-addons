define(function(require) {
  return {
    init: function init(app) {
      if (window.embedAPI) return;

      var addImageButton = app.refs.primaryToolbar
        .refs['add-image-button'];

      var embedAPI = {
        getImagePlacement: function(width, height) {
          var scale = addImageButton.scaleToFit(width, height);
          var pointerScale = app.getPointerScale();
          var canvasRect = app.refs.scaleSizer.getDOMNode()
            .getBoundingClientRect();

          scale = (scale / 100) * (1 / pointerScale);

          return {
            top: canvasRect.top,
            left: canvasRect.left,
            width: width * scale,
            height: height * scale
          };
        },
        addImage: function(url) {
          addImageButton.addImage(url);
        }
      };

      window.embedAPI = embedAPI;

      if (window.onembedapiready)
        window.onembedapiready(embedAPI);
    }
  }
});
