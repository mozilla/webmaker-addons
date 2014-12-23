define(function(require) {
  var React = require('react');
  var Movable = require('./movable');

  var MovableImage = React.createClass({
    mixins: [Movable],
    getInitialState: function() {
      return {
        movingNode: null
      };
    },
    render: function() {
      return <img style={this.getMovingStyle()} src={this.props.url} width={this.props.width} height={this.props.height}/>;
    }
  });

  return MovableImage;
});
