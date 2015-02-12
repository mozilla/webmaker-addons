define(function(require) {
  return {
    init: function init(app) {
      if (window.embedAPI) return;

      var addImageButton = app.refs.primaryToolbar
        .refs['add-image-button'];

      var embedAPI = {
        animateImageIntoCanvas: function(options) {
          var destRect = this.getImagePlacement(options.naturalWidth,
                                                options.naturalHeight);
          var img = document.createElement('img');
          img.setAttribute('src', options.src);
          img.style.position = 'absolute';
          ['transition',
           'mozTransition',
           'webkitTransition'].forEach(function(prop) {
            if (prop in img.style)
              img.style[prop] = 'all ' + (options.duration / 1000) + 's';
          });
          img.style.top = options.top + 'px';
          img.style.left = options.left + 'px';
          img.style.width = ((options.width == 'innerWidth')
                             ? window.innerWidth : options.width) + 'px';
          img.style.height = options.height + 'px';
          document.body.appendChild(img);

          /* Force reflow, so the browser knows bust a CSS transition.
           * For more information, see http://stackoverflow.com/a/21665117. */
          img.offsetHeight;

          img.style.top = destRect.top + 'px';
          img.style.left = destRect.left + 'px';
          img.style.width = destRect.width + 'px';
          img.style.height = destRect.height + 'px';

          setTimeout(function() {
            this.addImage(options.src, function() {
              img.parentNode.removeChild(img);
            });
          }.bind(this), options.duration);
        },
        getImagePlacement: function(width, height) {
          var scale = addImageButton.scaleToFit(width, height);
          var pointerScale = app.getPointerScale();
          var canvasRect = app.refs.canvas.getDOMNode()
            .getBoundingClientRect();

          scale = (scale / 100) * (1 / pointerScale);

          return {
            top: canvasRect.top,
            left: canvasRect.left,
            width: width * scale,
            height: height * scale
          };
        },
        addImage: function(url, cb) {
          addImageButton.addImage(url, cb);
        }
      };

      var applyImageOperation = function(op, args) {
        var METHOD_WHITELIST = ['addImage', 'animateImageIntoCanvas'];
        var processed = METHOD_WHITELIST.some(function(methodName) {
          if (op == methodName)
            embedAPI[methodName].apply(embedAPI, args);
        });

        if (!processed)
          console.log("unknown image operation: " + op);
      }

      window.embedAPI = embedAPI;

      if (!window.EMBEDDED_MODE) return;
      if (window.onembedapiready)
        window.onembedapiready(embedAPI);

      window.addEventListener('message', function(e) {
        if (e.source !== window.parent) return;
        var data = JSON.parse(e.data);
        if (data.type == 'log')
          console.log('log message from parent: ' + data.message);
        else if (data.type == 'image') {
          if (typeof(data.url) == 'string') {
            // Deprecated, only old versions of the addon send us this.
            embedAPI.addImage(data.url);
          } else if (typeof(data.options) == 'object') {
            applyImageOperation(data.options.operation, data.options.args);
          }
        }
      });
      window.parent.postMessage('ready', '*');
    }
  }
});
