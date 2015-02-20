// Just add a 'data-scale-to-parent' attribute to 
// any element on a page and include this script. Upon
// loading, it will make sure that the element scales
// down to the size of its parent element.

(function() {
  function capitalizeFirstChar(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  function setVendorPrefixedStyle(el, prop, value) {
    [
      prop,
      'moz' + capitalizeFirstChar(prop),
      'webkit' + capitalizeFirstChar(prop)
    ].some(function(prop) {
      if (prop in el.style) {
        el.style[prop] = value;
        return true;
      }
    });
  }

  function setScale(el, scale) {
    var scale = 'scale(' + scale + ')';

    setVendorPrefixedStyle(el, 'transform', scale);
  }

  function scaleToParent(el) {
    var parentEl = el.parentNode;
    var wrapperEl = document.createElement('div');
    var rect = el.getBoundingClientRect();
    var idealWidth = rect.width;
    var idealHeight = rect.height;

    setVendorPrefixedStyle(wrapperEl, 'transformOrigin', '0 0');

    parentEl.replaceChild(wrapperEl, el);

    var resize = function() {
      var parentRect = parentEl.getBoundingClientRect();
      var scale = parentRect.width / idealWidth;

      if (scale > 1)
        scale = 1;

      setScale(wrapperEl, scale);
    };

    wrapperEl.appendChild(el);

    window.addEventListener('resize', resize);
    resize();
  }

  function init() {
    var elements = document.querySelectorAll('[data-scale-to-parent]');
    [].slice.call(elements).forEach(scaleToParent);
  }

  if (document.readyState == "loading")
    document.addEventListener("DOMContentLoaded", init);
  else
    init();
})();
