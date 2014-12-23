define(function(require) {
  var React = require('react');
  var Hammer = require('hammer');

  var Movable = {
    propTypes: {
      firebaseRef: React.PropTypes.object.isRequired,
      x: React.PropTypes.number.isRequired,
      y: React.PropTypes.number.isRequired,
    },
  componentDidMount: function() {
      var node = this.getDOMNode();
      var hammer = this.hammer = new Hammer(node);
      hammer.on('panmove', function(e) {
        this.setState({
          movingNode: {
            x: this.props.x + e.deltaX,
            y: this.props.y + e.deltaY
          }
        });
      }.bind(this));
      hammer.on('panend', function(e) {
        var movingNode = this.state.movingNode;
        this.props.firebaseRef.update({
          x: movingNode.x,
          y: movingNode.y
        });
        this.setState({movingNode: null});
      }.bind(this));
    },
    componentWillUnmount: function() {
      this.hammer.destroy();
      this.hammer = null;
    },
    isMoving: function() {
      return this.state && this.state.movingNode;
    },
    getMovingStyle: function() {
      var coords = this.isMoving() ? this.state.movingNode : this.props;
      return {
        position: 'absolute',
        top: coords.y,
        left: coords.x
      };
    }
  };

  return Movable;
});
