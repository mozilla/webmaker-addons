define(function(require) {
  var React = require('react');
  var Hammer = require('hammer');

  var MovableImage = React.createClass({
    getInitialState: function() {
      return {
        movingImage: null
      };
    },
    componentDidMount: function() {
      var image = this.refs.image.getDOMNode();
      var hammer = this.hammer = new Hammer(image);
      hammer.on('panmove', function(e) {
        this.setState({
          movingImage: {
            x: this.props.item.x + e.deltaX,
            y: this.props.item.y + e.deltaY
          }
        });
      }.bind(this));
      hammer.on('panend', function(e) {
        var movingImage = this.state.movingImage;
        this.props.firebaseRef.update({
          x: movingImage.x,
          y: movingImage.y
        });
        this.setState({movingImag: null});
      }.bind(this));
    },
    componentWillUnmount: function() {
      this.hammer.destroy();
      this.hammer = null;
    },
    render: function() {
      var item = this.props.item;
      var coords = this.state.movingImage || item;
      var style = {
        position: 'absolute',
        top: coords.y,
        left: coords.x
      };

      return <img ref="image" style={style} src={item.url}/>;
    }
  });

  return MovableImage;
});
