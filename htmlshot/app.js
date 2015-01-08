var spawn = require('child_process').spawn;
var express = require('express');

var app = express();

var RENDER = __dirname + '/render.js';
var PORT = process.env.PORT || 3000;

app.get('/shot', function(req, res, next) {
  var html = (req.query.html || '').trim();
  if (!html) return res.sendStatus(204);
  res.type('image/png');
  spawn(process.execPath, [RENDER, html]).stdout.pipe(res);
});

app.listen(PORT, function() {
  console.log("listening on " + PORT);
});
