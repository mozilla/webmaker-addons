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
      hammer.on('panstart', this.handlePanStartAndMove);
      hammer.on('panmove', this.handlePanStartAndMove);
      hammer.on('panend', this.handlePanEnd);
      node.addEventListener('touchstart', function(e) {
        // Don't let the page scroll.
        e.preventDefault();
      });
      node.addEventListener('dragstart', function(e) {
        // Fix to make image dragging work on Firefox.
        e.preventDefault();
      });
    },
    handleTap: function(e) {
      this.props.onSelect(e);
    },
    handlePanStartAndMove: function(e) {
      if (e.type == 'panstart')
        this.props.onSelect(e);
      this.setState({
        movingNode: {
          x: this.props.x + e.deltaX * this.props.pointerScale,
          y: this.props.y + e.deltaY * this.props.pointerScale
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
        top: coords.y,
        left: coords.x,
        cursor: cursor
      };
    }
  };

  return Movable;
});
