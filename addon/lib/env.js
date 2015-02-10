var chrome = require('chrome');
var Cc = chrome.Cc;
var Ci = chrome.Ci;

// https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIEnvironment
exports.get = function(name) {
  var nsIEnvironment = Cc["@mozilla.org/process/environment;1"]
    .getService(Ci.nsIEnvironment);
  return nsIEnvironment.get(name);
};
