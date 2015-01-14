define(function(require) {
  return {
    init: function init(app) {
      if (window.embedAPI) return;

      var embedAPI = {
        addImage: function(url) {
          var addImageButton = app.refs['add-image-button'];
          addImageButton.addImage(url);
        }
      };

      window.embedAPI = embedAPI;

      if (window.onembedapiready)
        window.onembedapiready(embedAPI);
    }
  }
});
