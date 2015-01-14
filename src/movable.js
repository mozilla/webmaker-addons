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
      hammer.on('tap', this.handleTap);
      hammer.on('panstart', this.handlePanStart);
      hammer.on('panmove', this.handlePanMove);
      node.addEventListener('mousedown', function(e) {
        // Don't let text be selected, don't invoke
        // Firefox's default image dragging behavior, etc.
        e.preventDefault();
      });
      node.addEventListener('touchstart', function(e) {
        // Don't let the page scroll.
        e.preventDefault();
      });
    },
    handleTap: function(e) {
      this.props.onSelect(e);
    },
    handlePanStart: function(e) {
      this.props.onSelect(e);
      this.setState({
        movingStartX: this.props.x,
        movingStartY: this.props.y
      });
    },
    handlePanMove: function(e) {
      this.props.firebaseRef.update({
        x: Math.floor(this.state.movingStartX +
                      e.deltaX * this.props.getPointerScale()),
        y: Math.floor(this.state.movingStartY +
                      e.deltaY * this.props.getPointerScale())
      });
    },
    componentWillUnmount: function() {
      this.hammer.destroy();
      this.hammer = null;
    },
    getMovingStyle: function() {
      var cursor;

      if (this.props.isEditable) {
        if (this.props.isSelected) {
          cursor = 'move';
        } else {
          cursor = 'pointer';
        }
      }

      return {
        position: 'absolute',
        top: this.props.y,
        left: this.props.x,
        cursor: cursor
      };
    }
  };

  return Movable;
});
