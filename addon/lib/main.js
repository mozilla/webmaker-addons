var self = require('sdk/self');
var PageMod = require('sdk/page-mod').PageMod;
var Sidebar = require('sdk/ui/sidebar').Sidebar;
var prefs = require('sdk/preferences/service');

var env = require('./env');
var uuid = require('./uuid');
var md5 = require('./md5');

var BIN_PREF = 'extensions.webmakerAddon.bin';
var DEFAULT_IFRAME_URL = 'https://xmatthewx.github.io/webmaker-addons/';
var DEBUG_IFRAME_URL = env.get("WEBMAKER_ADDON_IFRAME_URL");
var DEBUG = !!DEBUG_IFRAME_URL;

var sidebarWorkerArray = [];
var sidebarMessageQueue = [];

var sidebar = Sidebar({
  id: 'webmaker-sidebar',
  title: 'Image Maker',
  url: self.data.url('sidebar.html'),
  onReady: function(worker) {
    sidebarWorkerArray.push(worker);
    worker.port.emit("init", {
      url: getIframeURL()
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

function getIframeURL() {
  if (DEBUG_IFRAME_URL) return DEBUG_IFRAME_URL;

  var bin;
  var email = prefs.get('services.sync.account');

  if (email) {
    bin = md5(email);
  } else {
    if (!prefs.get(BIN_PREF))
      prefs.set(BIN_PREF, uuid());
    bin = prefs.get(BIN_PREF);
  }

  return DEFAULT_IFRAME_URL + '?bin=' + bin + '&bust=' + Date.now();
}

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

if (DEBUG) {
  require('sdk/tabs').open('https://webmaker.org/en-US/');
  sidebar.show();
}
