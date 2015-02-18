var self = require('sdk/self');
var PageMod = require('sdk/page-mod').PageMod;
var Sidebar = require('sdk/ui/sidebar').Sidebar;
var prefs = require('sdk/preferences/service');
var windowUtils = require('sdk/window/utils');
var tabs = require('sdk/tabs');

var env = require('./env');
var uuid = require('./uuid');
var md5 = require('./md5');

var BIN_PREF = 'extensions.webmakerAddon.bin';
var DEFAULT_IFRAME_URL = 'http://xmatthewx.github.io/webmaker-addons/';
var DEBUG_IFRAME_URL = env.get("WEBMAKER_ADDON_IFRAME_URL");
var DEBUG = !!DEBUG_IFRAME_URL;

var sidebarArray = [];
var sidebarMessageQueue = [];

var sidebar = Sidebar({
  id: 'webmaker-sidebar',
  title: 'Image Maker',
  url: self.data.url('sidebar.html'),
  onReady: function(worker) {
    sidebarArray.push({
      browserWindow: windowUtils.getMostRecentBrowserWindow(),
      worker: worker
    });
    worker.port.on("iframeMessage", function(msg) {
      if (msg.type == 'openURL') {
        tabs.open(msg.url);
      } else {
        console.log("Unknown iframe message", msg);
      }
    });
    worker.port.emit("init", {
      url: getIframeURL()
    });
    sidebarMessageQueue.splice(0).forEach(function(args) {
      worker.port.emit.apply(worker.port, args);
    });
  },
  onDetach: function(worker) {
    for (var i = 0; i < sidebarArray.length; i++) {
      if (sidebarArray[i].worker === worker) {
        sidebarArray.splice(i, 1);
        return;
      }
    }
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
  var preferredWindow = windowUtils.getMostRecentBrowserWindow();

  if (sidebarArray.length == 0)
    return sidebarMessageQueue.push([message, data]);

  for (var i = 0; i < sidebarArray.length; i++) {
    if (sidebarArray[i].browserWindow === preferredWindow)
      break;
  }

  if (i == sidebarArray.length)
    i = 0;

  sidebarArray[i].worker.port.emit(message, data);
}

PageMod({
  include: '*',
  contentScriptFile: self.data.url('content-script.js'),
  onAttach: function(worker) {
    worker.port.on('image', function(options) {
      emitMessageToSidebar('image', options);
      sidebar.show();
    });
  }
});

if (DEBUG) {
  tabs.open('https://webmaker.org/en-US/');
  sidebar.show();
}
