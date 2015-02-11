var icon = null;
var iconTarget = null;
var iconImageURL, iconPositionRequestID;

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

  applyCSS(icon, {
    top: window.scrollY + rect.top,
    left: window.scrollX + rect.left
  });
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
  icon.textContent = '+';
  document.body.appendChild(icon);
  applyCSS(icon, {
    position: 'absolute',
    padding: 4,
    margin: 0,
    zIndex: '10000000',
    fontSize: 10,
    cursor: 'pointer',
    color: 'black',
    backgroundColor: 'yellow'
  });
  positionIcon();
  icon.addEventListener('mouseout', handleIconMouseOut, true);
  icon.addEventListener('click', handleIconClick, true);
  iconTarget.addEventListener('mouseout', handleIconTargetMouseOut, true);
}

function handleIconClick(e) {
  if (self.port)
    self.port.emit('image', iconImageURL);
  else
    window.alert('Send URL to canvas: ' + iconImageURL);
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
