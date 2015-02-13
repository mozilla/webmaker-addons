var icon = null;
var iconTarget = null;
var iconImageURL, iconPositionRequestID;

// This is taken from src/icons/AddImageAlt.svg, with some tweaks.
// We're inlining it here because it's easier right now.
var ICON_SVG = [
  '<svg width="48px" height="48px" viewBox="0 0 48 48" style="pointer-events: none">',
  '    <g fill="#FFFFFF"><circle cx="24" cy="24" r="15"></circle></g>',
  '    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">',
  '        <g fill="#FFBC00">',
  '            <g transform="translate(-1.000000, 0.000000)">',
  '                <path d="M9.1821172,0.212019245 C-1.74713073,11.1471381 -1.74532009,28.8716964 9.18754914,39.8045656 C20.1222293,50.7392458 37.8508487,50.7392458 48.7855289,39.8045656 L48.7771089,39.7961456 L48.7954121,39.7962369 L48.7954124,0.182546182 L9.18198001,0.182546417 L9.18211721,0.212018377 L9.1821172,0.212019245 Z M38.5714585,21.2597232 C38.5714585,20.3132935 37.8036005,19.5454355 36.8571708,19.5454355 L29.4285905,19.5454355 L29.4285905,12.1168552 C29.4285905,11.1704255 28.6607324,10.4025674 27.7143027,10.4025674 L24.2857272,10.4025674 C23.3392975,10.4025674 22.5714395,11.1704255 22.5714395,12.1168552 L22.5714395,19.5454355 L15.1428592,19.5454355 C14.1964295,19.5454355 13.4285714,20.3132935 13.4285714,21.2597232 L13.4285714,24.6882987 C13.4285714,25.6347284 14.1964295,26.4025865 15.1428592,26.4025865 L22.5714395,26.4025865 L22.5714395,33.8311668 C22.5714395,34.7775965 23.3392975,35.5454545 24.2857272,35.5454545 L27.7143027,35.5454545 C28.6607324,35.5454545 29.4285905,34.7775965 29.4285905,33.8311668 L29.4285905,26.4025865 L36.8571708,26.4025865 C37.8036005,26.4025865 38.5714585,25.6347284 38.5714585,24.6882987 L38.5714585,21.2597232 Z"></path>',
  '            </g>',
  '        </g>',
  '    </g>',
  '</svg>'
].join('\n');
var NATIVE_ICON_SIZE = 48;
var DEFAULT_ICON_SIZE = 16;
var TINY_ICON_SIZE = 12;
var HIDE_ICON_THRESHHOLD = 24;

function applyCSS(el, css) {
  Object.keys(css).forEach(function(property) {
    var value = css[property];
    if (typeof(css[property]) == 'number')
      value = value + 'px';
    el.style[property] = value;
  });
}

function positionIcon() {
  var rect = iconTarget.getBoundingClientRect();
  var rectSize = Math.min(rect.width, rect.height);
  var iconSize = rectSize >= NATIVE_ICON_SIZE
                 ? DEFAULT_ICON_SIZE
                 : TINY_ICON_SIZE;
  var iconScale = iconSize / NATIVE_ICON_SIZE;

  if (rectSize < HIDE_ICON_THRESHHOLD) {
    applyCSS(icon, {display: 'none'});
  } else {
    applyCSS(icon, {
      display: 'block',
      transform: 'scale(' + iconScale + ')',
      top: window.scrollY + rect.top,
      left: window.scrollX + rect.right - iconSize
    });
  }
  iconPositionRequestID = window.requestAnimationFrame(positionIcon);
}

function removeIcon() {
  if (!icon) return;

  icon.parentNode.removeChild(icon);
  icon = null;

  iconTarget.removeEventListener('mouseout', handleIconTargetMouseOut, true);
  iconTarget = null;

  window.cancelAnimationFrame(iconPositionRequestID);
}

function showIcon(target, imageURL) {
  if (!/^https?:\/\//.test(imageURL)) return;
  removeIcon();
  icon = document.createElement('div');
  iconTarget = target;
  iconImageURL = imageURL;
  icon.innerHTML = ICON_SVG;
  document.body.appendChild(icon);
  applyCSS(icon, {
    position: 'absolute',
    padding: 0,
    margin: 0,
    zIndex: '10000000',
    transformOrigin: '0% 0%',
    fontSize: 0,
    cursor: 'pointer'
  });
  positionIcon();
  icon.addEventListener('mouseout', handleIconMouseOut, true);
  icon.addEventListener('click', handleIconClick, true);
  iconTarget.addEventListener('mouseout', handleIconTargetMouseOut, true);
}

function handleIconClick(e) {
  var img = document.createElement('img');
  var target = iconTarget;
  var src = iconImageURL;

  img.onload = function() {
    var srcRect = target.getBoundingClientRect();
    var duration = 1000;
    var destRect = {
      top: -srcRect.height,
      left: 0,
      width: srcRect.width,
      height: srcRect.height
    };

    document.documentElement.appendChild(img);
    img.style.position = 'fixed';
    img.style.zIndex = '1000000000';

    img.style.background = target.style.background;
    img.style.top = srcRect.top + 'px';
    img.style.left = srcRect.left + 'px';
    img.style.width = srcRect.width + 'px';
    img.style.height = srcRect.height + 'px';

    ['transition',
     'mozTransition',
     'webkitTransition'].forEach(function(prop) {
      if (prop in img.style)
        img.style[prop] = 'all ' + (duration / 1000) + 's';
    });

    /* Force reflow, so the browser knows bust a CSS transition.
     * For more information, see http://stackoverflow.com/a/21665117. */
    img.offsetHeight;

    img.style.top = destRect.top + 'px';
    img.style.left = destRect.left + 'px';
    img.style.width = destRect.width + 'px';
    img.style.height = destRect.height + 'px';

    setTimeout(function() {
      var sidebarMessage = {
        operation: 'animateImageIntoCanvas',
        args: [{
          operation: 'animateImageIntoCanvas',
          duration: 1000,
          src: src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          top: -srcRect.height,
          left: 'innerWidth',
          width: img.naturalWidth,
          height: img.naturalHeight
        }]
      };

      if (!self.port)
        return window.alert('Send message to sidebar: ' +
                            JSON.stringify(sidebarMessage));

      self.port.emit('image', sidebarMessage);
    }, duration);
  };
  img.onerror = function() {
    alert("Alas, an error occurred.");
  };
  img.src = src;
}

function handleIconMouseOut(e) {
  if (e.relatedTarget === iconTarget) return;
  removeIcon();
}

function handleIconTargetMouseOut(e) {
  if (e.relatedTarget === icon) return;
  removeIcon();
}

function unquote(str) {
  var first = str[0];
  var last = str[str.length - 1];
  if (first != last) return str;
  if (first == "'" || first == '"')
  return str.slice(1, -1);
}

function processCssBackgroundImage(target) {
  if (!target || target === window.document) return;

  var style = window.getComputedStyle(target);
  var match = style.backgroundImage.match(/url\(([^)]+)\)/);

  if (!match)
    return processCssBackgroundImage(target.parentNode);
  showIcon(target, unquote(match[1]));
}

function processSvgImage(target) {
  var a = document.createElement('a');
  a.setAttribute('href', target.getAttribute('xlink:href'));
  showIcon(target, a.href);
}

window.addEventListener('mouseover', function(e) {
  var target = e.target;

  if (target === icon || target === iconTarget) return;
  if (target.nodeName == 'IMG')
    return showIcon(target, target.src);
  if (target.nodeName == 'image' && target.hasAttribute('xlink:href'))
    return processSvgImage(target);
  return processCssBackgroundImage(target);
}, true);
