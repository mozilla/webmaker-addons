define(function() {
  var React = require('react');

  var TRANSFORM_ORIGIN = '0 0';

  return React.createClass({
    getInitialState: function() {
      return {
        scale: 1
      };
    },
    getPointerScale: function() {
      return 1 / this.state.scale;
    },
    handleScaleResize: function() {
      var rect = this.getDOMNode().getBoundingClientRect();
      var idealWidth = this.props.width;
      var newScale;
      if (rect.width >= idealWidth) {
        newScale = 1;
      } else {
        newScale = rect.width / idealWidth;
      }
      if (this.state.scale != newScale)
        this.setState({scale: newScale});
    },
    componentDidMount: function() {
      window.addEventListener('resize', this.handleScaleResize);
      this.handleScaleResize();
      this.forceTransformOnIos();
    },
    componentDidUpdate: function() {
      this.forceTransformOnIos();
    },
    componentWillUnmount: function() {
      window.removeEventListener('resize', this.handleScaleResize);
    },
    forceTransformOnIos: function() {
      // An apparent bug on iOS 7 makes it so that transforms aren't
      // applied if the element isn't visible at the time that
      // the transform is set. This helps us get around that bug.
      var transform = this.refs.transform.getDOMNode();
      if (!('webkitTransform' in transform.style)) return;
      transform.style.webkitTransform = this.getTransform();
      transform.style.webkitTransformOrigin = TRANSFORM_ORIGIN;
    },
    getTransform: function() {
      return 'scale(' + this.state.scale + ')';
    },
    render: function() {
      var transform = this.getTransform();
      var scaleTransform = {
        transform: transform,
        webkitTransform: transform,
        mozTransform: transform,
        transformOrigin: TRANSFORM_ORIGIN,
        webkitTransformOrigin: TRANSFORM_ORIGIN,
        mozTransformOrigin: TRANSFORM_ORIGIN
      };

      return (
        <div style={{
          height: this.props.height * this.state.scale,
          margin: 10,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <div ref="transform" style={scaleTransform}>
            {this.props.children}
          </div>
        </div>
      );
    }
  });
});
