var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

var URL = "http://colours.neilorangepeel.com/";
var ROOT_DIR = __dirname + '/..';
var FILENAME = "src/colors/color-hash.json";

request(URL, function(err, res, body) {
  if (err) throw err;
  var $ = cheerio.load(body);
  var unorderedColors = {};
  var colorHash = {};

  // The color list is always delivered to us in random order, but
  // we want to serialize to JSON in a deterministic order so that
  // diffs in change history make sense, etc.
  $('ul.colour-list li.colour-entry').each(function() {
    unorderedColors[$('h1', this).text().trim()] = {
      type: $(this).hasClass('light') ? 'light' : 'dark',
      hex: $('.hex-value', this).text().trim()
    };
  });

  Object.keys(unorderedColors).sort().forEach(function(name) {
    colorHash[name] = unorderedColors[name];
  });

  fs.writeFileSync(ROOT_DIR + '/' + FILENAME, JSON.stringify(colorHash));
  console.log("Wrote " + FILENAME + ".");
});
