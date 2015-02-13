define(function(require) {
  var React = require('react');
  var KeypressMixin = require('../keypress-mixin');

  var DEFAULT_COLORS = [
    '#fff',
    '#000',
    'rgb(213,37,213)',
    'rgb(38,163,213)',
    'rgb(145,210,79)',
    'rgb(234,220,41)',
    'rgb(242,162,32)',
    'rgb(232,74,27)'
  ];

  var ColorModal = React.createClass({
    mixins: [KeypressMixin],
    getDefaultProps: function() {
      return {
        colors: DEFAULT_COLORS
      };
    },
    handleKeypress: function(keyCode) {
      if (keyCode == this.KEY_ESC)
        this.props.dismissModal();
    },
    handleClick: function(color, e) {
      this.props.firebaseRef.update({
        color: color
      });
    },
    render: function() {
      return (
        <div className="color-modal">
          {this.props.colors.map(function(color, i) {
            return <button key={i}
                           style={{background: color}}
                           onClick={this.handleClick.bind(this, color)}/>;
          }, this)}
        </div>
      );
    }
  });

  return ColorModal;
});
