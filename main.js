require([
  "firebase",
  "react",
  "jsx!src/app"
], function(Firebase, React, App) {
  var bin = window.location.search.match(/[&?]bin=([A-Za-z0-9\-]+)/);

  bin = bin ? bin[1] : "default";

  var firebin = new Firebase(window.BASE_FIREBASE_URL + bin);

  var app = React.render(
    React.createElement(App, {
      firebaseRef: firebin
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
});
