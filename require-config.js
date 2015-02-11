var BASE_FIREBASE_URL = "https://sticker-fun.firebaseio.com/";
var BASE_HTMLSHOT_URL = "http://cupcakes.hivelearningnetworks.org:3000/";

var EMBEDDED_MODE = window.parent !== window;
var SIMPLE_MODE = !/[&?]simple=off/.test(location.search);

// Set this to null to make *all* fonts available.
var FONT_WHITELIST = SIMPLE_MODE ? [
  "Knewave",
  "Londrina Sketch",
  "Open Sans",
  "Pacifico",
  "Prociono"
] : null;

var DEFAULT_FONT = 'Open Sans';
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;

// Changing this to true will auto-select the first item in the
// canvas on page load, which is useful for debugging anything
// related to selections.
var DEBUG_AUTOSELECT_FIRST_ITEM = false;

// Changing this to true will automatically show the export
// modal on page load, which is useful for debugging it.
var DEBUG_AUTOSHOW_EXPORT_MODAL = false;

var require = {
  paths: {
    "underscore": "vendor/underscore",
    "hammer": "vendor/hammer",
    "firebase": "vendor/firebase",
    "text": "vendor/require.text",
    "jsx": "vendor/require.jsx",
    "JSXTransformer": "vendor/react/build/JSXTransformer",
    "react": "vendor/react/build/react-with-addons"
  },
  jsx: {
    fileExtension: '.jsx'
  },
  shim: {
    "underscore": {
      exports: "_"
    },
    "firebase": {
      exports: "Firebase"
    }
  },
  packages: [
    {
      name: "src/fonts",
      main: "index"
    }
  ],
  // Grrr. http://stackoverflow.com/a/8479953
  urlArgs: "bust=" + Date.now()
};
