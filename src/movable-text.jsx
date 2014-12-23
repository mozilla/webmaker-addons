define(function(require) {
  var React = require('react');
  var Hammer = require('hammer');

  var MovableText = React.createClass({
    getInitialState: function() {
      return {
        movingText: null
      };
    },
    componentDidMount: function() {
      var text = this.refs.text.getDOMNode();
      var hammer = this.hammer = new Hammer(text);
      hammer.on('panmove', function(e) {
        this.setState({
          movingText: {
            x: this.props.x + e.deltaX,
            y: this.props.y + e.deltaY
          }
        });
      }.bind(this));
      hammer.on('panend', function(e) {
        var movingText = this.state.movingText;
        if (!movingText) {
          // Not sure how this can happen, but apparently it does...
          console.log("state.movingText is null, how odd.");
          return;
        }
        this.props.firebaseRef.update({
          x: movingText.x,
          y: movingText.y
        });
        this.setState({movingText: null});
      }.bind(this));
    },
    componentWillUnmount: function() {
      this.hammer.destroy();
      this.hammer = null;
    },
    render: function() {
      var coords = this.state.movingText || this.props;
      var style = {
        background: 'rgba(255, 255, 255, 0.5)',
        padding: 10,
        position: 'absolute',
        top: coords.y,
        left: coords.x
      };

      return <span ref="text" style={style}>{this.props.text}</span>;
    }
  });

  return MovableText;
});
