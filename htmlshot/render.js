var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

var SLIMERJS = process.env.SLIMERJS || 'slimerjs';
var RASTERIZE = path.join(__dirname, 'slimer-rasterize.js');
var HTML = process.argv[2];

var tempBasename = 'tempshot_' + Date.now() + '_' + Math.random();
var tempPngFilename = tempBasename + '.png';
var tempHtmlFilename = tempBasename + '.html';

//var dataURL = 'data:text/html;base64,' +
//              (new Buffer(HTML)).toString('base64');

fs.writeFileSync(tempHtmlFilename, HTML);

var cmdline = [
  SLIMERJS,
  RASTERIZE,
//  dataURL,
  path.join(process.cwd(), tempHtmlFilename),
  tempPngFilename
].join(' ');

process.stderr.write("Executing: " + cmdline + "\n");

exec(cmdline, function(error, stdout, stderr) {
  var code = error ? error.code : 0;
  process.stderr.write("CODE " + code + "\n");
  if (code) {
    process.stderr.write("STDOUT:\n" + stdout + "\nSTDERR:\n" + stderr);
    return process.exit(code);
  }
  fs.createReadStream(tempPngFilename).pipe(process.stdout)
});

process.on('exit', function() {
  process.stderr.write("EXIT\n");
  [tempPngFilename, tempHtmlFilename].forEach(function(filename) {
    if (fs.existsSync(filename))
      fs.unlinkSync(filename);
  });
});
