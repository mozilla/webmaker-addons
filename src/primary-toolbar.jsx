define(function(require) {
  var React = require('react');
  var TypeMap = require('./type-map');

  var PrimaryToolbar = React.createClass({
    makeAddButton: function(type) {
      return React.createElement(TypeMap[type].AddButton, {
        ref: 'add-' + type + '-button',
        canvasWidth: this.props.canvasWidth,
        canvasHeight: this.props.canvasHeight,
        firebaseRef: this.props.firebaseRef
      });
    },
    render: function() {
      return (
        <ul className="list-inline">
          {Object.keys(TypeMap).map(function(type) {
            var addButton = this.makeAddButton(type);
            return <li key={type}>{addButton}</li>;
          }, this)}
          <li><button className="btn btn-default" onClick={this.props.onExport}>
            <i className="fa fa-download"></i>
          </button></li>
        </ul>
      );
    }
  });

  return PrimaryToolbar;
});
