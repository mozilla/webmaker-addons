define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var Movable = require('./movable');

  var MovableText = React.createClass({
    mixins: [Movable],
    getInitialState: function() {
      return {
        movingNode: null
      };
    },
    render: function() {
      var style = _.extend({
        background: 'rgba(255, 255, 255, 0.5)',
        padding: 10,
      }, this.getMovingStyle());

      return <span ref="text" style={style}>{this.props.text}</span>;
    }
  });

  return MovableText;
});
