define(function() {
  return {
    KEY_BACKSPACE: 8,
    KEY_ESC: 27,
    KEY_ARROW_LEFT: 37,
    KEY_ARROW_UP: 38,
    KEY_ARROW_RIGHT: 39,
    KEY_ARROW_DOWN: 40,
    // http://stackoverflow.com/a/2768256
    preventBrowserFromNavigatingBack: function(event) {
      var doPrevent = false;

      var d = event.srcElement || event.target;
      if ((d.tagName.toUpperCase() === 'INPUT' && (
           d.type.toUpperCase() === 'TEXT' ||
           d.type.toUpperCase() === 'PASSWORD' ||
           d.type.toUpperCase() === 'FILE' ||
           d.type.toUpperCase() === 'EMAIL' ||
           d.type.toUpperCase() === 'SEARCH' ||
           d.type.toUpperCase() === 'DATE' )) ||
          d.tagName.toUpperCase() === 'TEXTAREA') {
        doPrevent = d.readOnly || d.disabled;
      } else {
        doPrevent = true;
      }

      if (doPrevent) {
        event.preventDefault();
      }
    },
    handleRawKeypress: function(e) {
      if (e.keyCode == this.KEY_BACKSPACE)
        this.preventBrowserFromNavigatingBack(e);

      if (e.target !== document.body) return;

      this.handleKeypress(e.keyCode, e);
    },
    componentDidMount: function() {
      window.addEventListener('keydown', this.handleRawKeypress, false);
    },
    componentWillUnmount: function() {
      window.removeEventListener('keydown', this.handleRawKeypress, false);
    }
  };
});
