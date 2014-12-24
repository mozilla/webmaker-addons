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
      hammer.on('panstart', this.handlePanStartAndMove);
      hammer.on('panmove', this.handlePanStartAndMove);
      hammer.on('panend', this.handlePanEnd);
      node.addEventListener('dragstart', function(e) {
        // Fix to make image dragging work on Firefox.
        e.preventDefault();
      });
    },
    handlePanStartAndMove: function(e) {
      this.setState({
        movingNode: {
          x: this.props.x + e.deltaX,
          y: this.props.y + e.deltaY
        }
      });
    },
    handlePanEnd: function(e) {
      var movingNode = this.state.movingNode;
      this.props.firebaseRef.update({
        x: movingNode.x,
        y: movingNode.y
      });
      this.setState({movingNode: null});
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
