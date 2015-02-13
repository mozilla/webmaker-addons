require([
  "firebase",
  "react",
  "src/png-export",
  "src/embed-api",
  "jsx!src/app"
], function(Firebase, React, PNGExport, EmbedAPI, App) {
  var bin = window.location.search.match(/[&?]bin=([A-Za-z0-9\-]+)/);

  bin = bin ? bin[1] : "default";

  if (window.DEBUG_FORCE_BIN_NAME)
    bin = window.DEBUG_FORCE_BIN_NAME;

  var firebin = new Firebase(window.BASE_FIREBASE_URL + bin);

  var app = React.render(
    React.createElement(App, {
      firebaseRef: firebin,
      canvasWidth: window.CANVAS_WIDTH,
      canvasHeight: window.CANVAS_HEIGHT
    }),
    document.getElementById('app')
  );

  document.documentElement.onclick = function(e) {
    if (e.target === document.documentElement)
      app.clearSelection();
  };

  // For debugging purposes only!
  window.app = app;

  if (bin == "offline") {
    Firebase.goOffline();
    firebin.set({});
  }

  EmbedAPI.init(app);

  if (typeof(window.DEBUG_ONREADY_HOOK) == 'function')
    window.DEBUG_ONREADY_HOOK(app);

  document.body.addEventListener('dragover', function(e) {
    for (var i = 0; i < e.dataTransfer.types.length; i++) {
      if (e.dataTransfer.types[i] == 'Files') {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        return;
      }
    }
  });

  document.body.addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();

    var file = e.dataTransfer.files[0];
    var reader = new FileReader();

    if (file.type != 'image/png') return;

    reader.onload = function(e) {
      var items = PNGExport.extractItemsFromPNG(e.target.result);
      if (!items) return;
      app.importItems(items);
    };
    reader.readAsArrayBuffer(file);
  });
});
