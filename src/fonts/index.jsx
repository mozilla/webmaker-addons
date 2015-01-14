define(function(require) {
  var React = require('react');
  var FONTS = Object.freeze(JSON.parse(require('text!./font-list.json')));

  if (window.FONT_WHITELIST)
    FONTS = window.FONT_WHITELIST;

  var Fonts = React.createClass({
    statics: {
      getAvailable: function() {
        return FONTS;
      },
      createLinkElements: function(fonts, protocol) {
        protocol = protocol || '';
        return fonts.map(function(family) {
          var href = protocol + "//fonts.googleapis.com/css?family=" +
                     family.replace(/ /g, '+');
          return <link key={family} rel="stylesheet" href={href}/>;
        });
      }
    },
    render: function() {
      return (
        <div style={{display: 'none'}}>
          {Fonts.createLinkElements(this.props.fonts)}
        </div>
      );
    }
  });

  return Fonts;
});
