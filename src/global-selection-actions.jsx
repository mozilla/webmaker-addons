define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var itemUtils = require('./item-utils');

  var BaseSelectionActions = React.createClass({
    statics: {
      refName: 'globalSelectionActions'
    },
    handleRemove: function() {
      this.props.firebaseRef.parent().remove();
    },
    render: function() {
      return (
        <div className="button-group">
          <button onClick={this.handleRemove} title={"Remove selected " + this.props.itemType}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
      );
    }
  });

  return BaseSelectionActions;
});
