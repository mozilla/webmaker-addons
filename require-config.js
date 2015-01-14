var BASE_FIREBASE_URL = "https://sticker-fun.firebaseio.com/";
var BASE_HTMLSHOT_URL = "http://cupcakes.hivelearningnetworks.org:3000/";

// Set this to null to make *all* fonts available.
var FONT_WHITELIST = [
  "Knewave",
  "Londrina Sketch",
  "Open Sans",
  "Pacifico",
  "Prociono"
];

var DEFAULT_FONT = 'Open Sans';

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
