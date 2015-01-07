var spawn = require('child_process').spawn;
var fs = require('fs');

var PHANTOMJS = process.env.PHANTOMJS || 'phantomjs';
var RASTERIZE = __dirname + '/phantom-rasterize.js';
var HTML = process.argv[2];

var tempBasename = 'tempshot_' + Date.now() + '_' + Math.random();
var tempPngFilename = tempBasename + '.png';
var tempHtmlFilename = tempBasename + '.html';

//var dataURL = 'data:text/html;base64,' +
//              (new Buffer(HTML)).toString('base64');

fs.writeFileSync(tempHtmlFilename, HTML);

var phantom = spawn(PHANTOMJS, [
  RASTERIZE,
//  dataURL,
  tempHtmlFilename,
  tempPngFilename,
  '640px*480px'
]);

phantom.on('close', function(code) {
  process.stderr.write("CODE " + code + "\n");
  if (code) return process.exit(code);
  fs.createReadStream(tempPngFilename).pipe(process.stdout);
});

process.on('exit', function() {
  process.stderr.write("EXIT\n");
  [tempPngFilename, tempHtmlFilename].forEach(function(filename) {
    if (fs.existsSync(filename))
      fs.unlinkSync(filename);
  });
});
