define(function(require) {
  var React = require('react');

  var SelectionFrame = React.createClass({
    getInitialState: function() {
      return {top: 0, left: 0, width: 0, height: 0};
    },
    select: function(node) {
      this.selectedNode = node;
      window.cancelAnimationFrame(this.requestID);
      if (node) {
        this.requestID = window.requestAnimationFrame(
          this.handleAnimationFrame
        );
      } else {
        this.setState(this.getInitialState());
      }
    },
    handleAnimationFrame: function() {
      var rect = this.selectedNode.getBoundingClientRect();
      this.setState({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      });
      this.requestID = window.requestAnimationFrame(
        this.handleAnimationFrame
      );
    },
    componentWillUnmount: function() {
      window.cancelAnimationFrame(this.requestID);
    },
    render: function() {
      var state = this.state;
      if (state.width == 0 && state.height == 0)
        return null;
      return <div style={{
        pointerEvents: 'none',
        position: 'absolute',
        border: '1px dashed yellow',
        boxShadow: '0 0 2px black',
        zIndex: 1000,
        top: state.top,
        left: state.left,
        width: state.width,
        height: state.height
      }}/>
    }
  });

  return SelectionFrame;
});
