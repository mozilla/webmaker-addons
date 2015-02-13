define(function(require) {
  var React = require('react');
  var Fonts = require('jsx!../fonts');
  var KeypressMixin = require('../keypress-mixin');

  var DEFAULT_AVAILABLE_FONTS = [
    "Knewave",
    "Londrina Sketch",
    "Open Sans",
    "Pacifico",
    "Prociono"
  ];

  var FontModal = React.createClass({
    mixins: [KeypressMixin],
    getDefaultProps: function() {
      return {
        availableFonts: DEFAULT_AVAILABLE_FONTS
      };
    },
    handleClick: function(font, e) {
      this.props.firebaseRef.update({
        fontFamily: font
      });
    },
    handleKeypress: function(keyCode) {
      if (keyCode == this.KEY_ESC)
        this.props.dismissModal();
    },
    render: function() {
      return (
        <div className="translucent-modal font-modal">
          {Fonts.createLinkElements(this.props.availableFonts)}
          <div className="translucent-modal-content">
            <ul>
              {this.props.availableFonts.map(function(font) {
                return (
                  <li key={font}
                      onClick={this.handleClick.bind(this, font)}
                      style={{fontFamily: font}}>
                    {font}
                  </li>
                );
              }, this)}
            </ul>
          </div>
        </div>
      );
    }
  });

  return FontModal;
});
