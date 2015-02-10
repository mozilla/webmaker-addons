var chrome = require('chrome');
var Cc = chrome.Cc;
var Ci = chrome.Ci;

// https://dxr.mozilla.org/mozilla-central/source/toolkit/webapps/WebappOSUtils.jsm
function md5(data) {
  var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].
                  createInstance(Ci.nsIScriptableUnicodeConverter);
  converter.charset = "UTF-8";
  var result = {};
  // Data is an array of bytes.
  data = converter.convertToByteArray(data, result);

  var hasher = Cc["@mozilla.org/security/hash;1"].
               createInstance(Ci.nsICryptoHash);
  hasher.init(hasher.MD5);
  hasher.update(data, data.length);
  // We're passing false to get the binary hash and not base64.
  var hash = hasher.finish(false);

  function toHexString(charCode) {
    return ("0" + charCode.toString(16)).slice(-2);
  }

  // Convert the binary hash data to a hex string.
  return [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
}

module.exports = md5;
