var spawn = require('child_process').spawn;
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var RENDER = __dirname + '/render.js';
var PORT = process.env.PORT || 3000;

app.get('/', function(req, res, next) {
  res.type('text/html');
  fs.createReadStream(__dirname + '/index.html').pipe(res);
});

app.post('/shot', bodyParser.urlencoded({
  extended: false
}), function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  var html = (req.body.html || '').trim();
  if (!html) return res.sendStatus(204);
  res.type('image/png');
  res.set('Content-Disposition',
          'attachment; filename="awesome-thing.png"');
  spawn(process.execPath, [RENDER, html]).stdout.pipe(res);
});

app.listen(PORT, function() {
  console.log("listening on " + PORT);
});
