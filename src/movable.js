define(function(require) {
  var React = require('react');
  var Hammer = require('hammer');

  var Nudging = {
    nudgeUp: function() {
      this.props.firebaseRef.update({y: this.props.y - 1});
    },
    nudgeDown: function() {
      this.props.firebaseRef.update({y: this.props.y + 1});
    },
    nudgeLeft: function() {
      this.props.firebaseRef.update({x: this.props.x - 1});
    },
    nudgeRight: function() {
      this.props.firebaseRef.update({x: this.props.x + 1});
    }
  };

  var Movable = _.extend({}, Nudging, {
    Nudging: Nudging,
    propTypes: {
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
      var MIN_SHOW_PX = 16;
      var myRect = this.getDOMNode().getBoundingClientRect();
      var cWidth = this.props.canvasWidth;
      var cHeight = this.props.canvasHeight;
      var newX = Math.floor(this.state.movingStartX +
                            e.deltaX * this.props.getPointerScale());
      var newY = Math.floor(this.state.movingStartY +
                            e.deltaY * this.props.getPointerScale());

      if (newX + myRect.width - MIN_SHOW_PX < 0) {
        newX = MIN_SHOW_PX - myRect.width;
      } else if (cWidth - newX < MIN_SHOW_PX) {
        newX = cWidth - MIN_SHOW_PX;
      }

      if (newY + myRect.height - MIN_SHOW_PX < 0) {
        newY = MIN_SHOW_PX - myRect.height;
      } else if (cHeight - newY < MIN_SHOW_PX) {
        newY = cHeight - MIN_SHOW_PX;
      }

      this.props.firebaseRef.update({
        x: newX,
        y: newY
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
  });

  return Movable;
});
