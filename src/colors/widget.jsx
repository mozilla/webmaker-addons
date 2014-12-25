define(function(require) {
  var React = require('react');
  var COLORS = JSON.parse(require('text!./color-hash.json'));

  var ColorWidget = React.createClass({
    render: function() {
      return (
        <select value={this.props.value} onChange={this.props.onChange} className={this.props.className}>
          {Object.keys(COLORS).map(function(name) {
            var info = COLORS[name];
            return <option key={name} value={name} style={{
              backgroundColor: name,
              color: info.type == "light" ? "black" : "white"
            }}>{name}</option>
          })}
        </select>
      );
    }
  });

  return ColorWidget;
});
