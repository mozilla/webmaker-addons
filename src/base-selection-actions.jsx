define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var itemUtils = require('./item-utils');

  var BaseSelectionActions = React.createClass({
    statics: {
      refName: 'baseSelectionActions'
    },
    handleRemove: function() {
      this.props.firebaseRef.parent().remove();
    },
    handleBringToFront: function() {
      this.props.firebaseRef.parent().update({
        order: itemUtils.getMaxOrder(this.props.allItems) + 1
      });
    },
    handleSendToBack: function() {
      this.props.firebaseRef.parent().update({
        order: itemUtils.getMinOrder(this.props.allItems) - 1
      });
    },
    render: function() {
      return (
        <div className="button-group">
          <button onClick={this.handleRemove} title={"Remove selected " + this.props.itemType}>
            <i className="fa fa-trash"></i>
          </button>
          <button onClick={this.handleSendToBack} title={"Send selected " + this.props.itemType + " to back"}>
            <i className="fa fa-mail-reply"></i>
          </button>
          <button onClick={this.handleBringToFront} title={"Bring selected " + this.props.itemType + " to front"}>
            <i className="fa fa-mail-forward"></i>
          </button>
        </div>
      );
    }
  });

  return BaseSelectionActions;
});
