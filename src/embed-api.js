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
          var canvasRect = app.refs.canvas.getDOMNode()
            .getBoundingClientRect();

          scale = (scale / 100) * (1 / pointerScale);

          return {
            top: canvasRect.top,
            left: canvasRect.left,
            width: width * scale,
            height: height * scale
          };
        },
        addImage: function(url, cb) {
          addImageButton.addImage(url, cb);
        }
      };

      window.embedAPI = embedAPI;

      if (!window.EMBEDDED_MODE) return;
      if (window.onembedapiready)
        window.onembedapiready(embedAPI);

      window.addEventListener('message', function(e) {
        if (e.source !== window.parent) return;
        var data = JSON.parse(e.data);
        if (data.type == 'log')
          console.log('log message from parent: ' + data.message);
        else if (data.type == 'image')
          embedAPI.addImage(data.url);
      });
      window.parent.postMessage('ready', '*');
    }
  }
});
