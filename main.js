require([
  "firebase",
  "react",
  "src/embed-api",
  "jsx!src/app"
], function(Firebase, React, EmbedAPI, App) {
  var bin = window.location.search.match(/[&?]bin=([A-Za-z0-9\-]+)/);

  bin = bin ? bin[1] : "default";

  if (window.DEBUG_FORCE_BIN_NAME)
    bin = window.DEBUG_FORCE_BIN_NAME;

  document.body.classList.remove('loading');

  var firebin = new Firebase(window.BASE_FIREBASE_URL + bin);

  firebin.once("value", function(snapshot) {
    var app = React.render(
      React.createElement(App, {
        firebaseRef: firebin,
        initialItems: snapshot.val(),
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

    EmbedAPI.init(app);

    if (typeof(window.DEBUG_ONREADY_HOOK) == 'function')
      window.DEBUG_ONREADY_HOOK(app);
  });

  if (bin == "offline") {
    Firebase.goOffline();
    firebin.set({});
  }
});
