define(function(require) {
  var React = require('react');
  var FONTS = Object.freeze(JSON.parse(require('text!./font-list.json')));

  var Fonts = React.createClass({
    statics: {
      getAvailable: function() {
        return FONTS;
      }
    },
    createLinkElements: function() {
      return this.props.fonts.map(function(family) {
        var href = "//fonts.googleapis.com/css?family=" +
                   family.replace(/ /g, '+');
        return <link key={family} rel="stylesheet" href={href}/>;
      });
    },
    render: function() {
      return (
        <div style={{display: 'none'}}>{this.createLinkElements()}</div>
      );
    }
  });

  return Fonts;
});
