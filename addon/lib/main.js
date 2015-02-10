var self = require('sdk/self');
var PageMod = require('sdk/page-mod').PageMod;
var Sidebar = require('sdk/ui/sidebar').Sidebar;
var prefs = require('sdk/preferences/service');

var env = require('./env');
var md5 = require('./md5');

var IFRAME_URL = env.get("WEBMAKER_ADDON_IFRAME_URL");
var DEBUG = !!IFRAME_URL;

var sidebar = Sidebar({
  id: 'webmaker-sidebar',
  title: 'Webmaker',
  url: self.data.url('sidebar.html'),
  onReady: function(worker) {
    worker.port.emit("init", {
      // TODO: hash prefs.get('services.sync.account') or
      // require('util/uuid') to determine a unique bin for
      // the user.
      url: IFRAME_URL
    });
  }
});

PageMod({
  include: '*',
  contentScriptFile: self.data.url('content-script.js')
});

if (DEBUG)
  sidebar.show();
