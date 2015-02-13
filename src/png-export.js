define(function(require) {
  var base64 = require('./base64');
  var PNGBaker = require('png-baker');

  // http://www.textfixer.com/tutorials/javascript-line-breaks.php
  var removeNewlines = function(str) {
    str = str.replace(/(\r\n|\n|\r)/gm, "");
    return str;
  }

  var PNGExport = {
    htmlToDataURL: function(html) {
      var utf8 = base64.strToUTF8Arr(html);
      return 'data:text/html;charset=utf-8;base64,' +
             removeNewlines(base64.base64EncArr(utf8));
    },
    jsonToDataURL: function(obj) {
      var utf8 = base64.strToUTF8Arr(JSON.stringify(obj));
      return 'data:application/json;charset=utf-8;base64,' +
             removeNewlines(base64.base64EncArr(utf8));
    },
    jsonFromDataURL: function(url) {
      var match = url.match(
        /^data:application\/json;charset=utf-8;base64,(.+)/
      );

      try {
        var json = base64.UTF8ArrToStr(base64.base64DecToArr(match[1]));
        return JSON.parse(json);
      } catch (e) {
        return null;
      }
    },
    extractItemsFromPNG: function(arrayBuffer) {
      var baker = new PNGBaker(arrayBuffer);
      var itemsURL = baker.textChunks['webmaker-addon:items-url'];

      if (!itemsURL) return null;
      return this.jsonFromDataURL(itemsURL);
    },
    export: function(options, cb) {
      var url = window.BASE_HTMLSHOT_URL + 'shot';
      var html = options.html;
      var req = new XMLHttpRequest();
      var itemsURL = this.jsonToDataURL(options.items);
      var htmlURL = this.htmlToDataURL(html);

      req.open('POST', url);
      req.responseType = 'arraybuffer';
      req.setRequestHeader("Content-type",
                           "application/x-www-form-urlencoded");
      req.onload = function() {
        if (req.status != 200)
          return cb(new Error("XMLHttpRequest got HTTP " + req.status));
        var baker = new PNGBaker(req.response);
        baker.textChunks['webmaker-addon:items-url'] = itemsURL;
        baker.textChunks['webmaker-addon:html-url'] = htmlURL;
        cb(null, baker.toBlob());
      };
      req.onerror = function() {
        cb(new Error("XMLHttpRequest failed"));
      };
      req.send('html=' + encodeURIComponent(html));
    }
  };

  return PNGExport;
});
