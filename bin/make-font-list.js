var request = require('request');
var fs = require('fs');

var API_KEY = "AIzaSyDHYyoV3LUqIuJHGU1dn_QRMcCZUrnrn9o";
var URL = "https://www.googleapis.com/webfonts/v1/webfonts?key=" +
          API_KEY;
var ROOT_DIR = __dirname + '/..';
var FILENAME = "src/fonts/font-list.json";

request(URL, function(err, body) {
  if (err) throw err;
  var fonts = {};
  var fontList = JSON.parse(body.body).items.map(function(font) {
    return font.family;
  });
  fs.writeFileSync(ROOT_DIR + '/' + FILENAME, JSON.stringify(fontList));
  console.log("Wrote " + FILENAME + ".");
});
