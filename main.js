require([
  "firebase",
  "react",
  "jsx!src/app"
], function(Firebase, React, App) {
  var bin = window.location.search.match(/[&?]bin=([A-Za-z0-9\-]+)/);

  bin = bin ? bin[1] : "default";

  var firebin = new Firebase("https://sticker-fun.firebaseio.com/" + bin);

  var app = React.render(
    React.createElement(App, {
      firebaseRef: firebin
    }),
    document.getElementById('app')
  );

  // For debugging purposes only!
  window.app = app;
});
