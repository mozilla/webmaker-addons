var self = require('sdk/self');
var PageMod = require('sdk/page-mod').PageMod;
var Sidebar = require('sdk/ui/sidebar').Sidebar;
var prefs = require('sdk/preferences/service');

var env = require('./env');
var md5 = require('./md5');

var IFRAME_URL = env.get("WEBMAKER_ADDON_IFRAME_URL");
var DEBUG = !!IFRAME_URL;

var sidebarWorkerArray = [];
var sidebarMessageQueue = [];

var sidebar = Sidebar({
  id: 'webmaker-sidebar',
  title: 'Webmaker',
  url: self.data.url('sidebar.html'),
  onReady: function(worker) {
    sidebarWorkerArray.push(worker);
    worker.port.emit("init", {
      // TODO: hash prefs.get('services.sync.account') or
      // require('util/uuid') to determine a unique bin for
      // the user.
      url: IFRAME_URL
    });
    sidebarMessageQueue.splice(0).forEach(function(args) {
      worker.port.emit.apply(worker.port, args);
    });
  },
  onDetach: function(worker) {
    var index = sidebarWorkerArray.indexOf(worker);
    if (index != -1)
      sidebarWorkerArray.splice(index, 1);
  }
});

function emitMessageToSidebar(message, data) {
  if (sidebarWorkerArray.length == 0)
    return sidebarMessageQueue.push([message, data]);
  sidebarWorkerArray[0].port.emit(message, data);
}

PageMod({
  include: '*',
  contentScriptFile: self.data.url('content-script.js'),
  onAttach: function(worker) {
    worker.port.on('image', function(url) {
      emitMessageToSidebar('image', url);
      sidebar.show();
    });
  }
});

if (DEBUG)
  require('sdk/tabs').open('https://webmaker.org/en-US/');
