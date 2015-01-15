define(function(require) {
  var React = require('react');
  var TypeMap = require('./type-map');

  var PrimaryToolbar = React.createClass({
    makeAddButton: function(type) {
      return React.createElement(TypeMap[type].AddButton, {
        ref: 'add-' + type + '-button',
        key: type,
        canvasWidth: this.props.canvasWidth,
        canvasHeight: this.props.canvasHeight,
        firebaseRef: this.props.firebaseRef
      });
    },
    render: function() {
      return (
        <section style={{float: 'right'}}>
          {Object.keys(TypeMap).map(function(type) {
            return this.makeAddButton(type);
          }, this)}
          <button onClick={this.props.onExport}>
            <i className="fa fa-download"></i>
          </button>
        </section>
      );
    }
  });

  return PrimaryToolbar;
});
