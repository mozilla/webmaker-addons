define(function(require) {
  var _ = require('underscore');
  var React = require('react');

  var BaseSelectionActions = React.createClass({
    handleRemove: function() {
      this.props.firebaseRef.parent().remove();
    },
    handleBringToFront: function() {
      var frontItem = _.max(_.values(this.props.allItems), function(item) {
        return item.order || 0;
      });
      this.props.firebaseRef.parent().update({
        order: (frontItem.order || 0) + 1
      });
    },
    handleSendToBack: function() {
      var backItem = _.min(_.values(this.props.allItems), function(item) {
        return item.order || 0;
      });
      this.props.firebaseRef.parent().update({
        order: (backItem.order || 0) - 1
      });
    },
    render: function() {
      return (
        <div className="btn-group" role="group">
          <button className="btn btn-default" onClick={this.handleRemove} title={"Remove selected " + this.props.itemType}>
            <i className="fa fa-trash"></i>
          </button>
          <button className="btn btn-default" onClick={this.handleSendToBack} title={"Send selected " + this.props.itemType + " to back"}>
            <i className="fa fa-mail-reply"></i>
          </button>
          <button className="btn btn-default" onClick={this.handleBringToFront} title={"Bring selected " + this.props.itemType + " to front"}>
            <i className="fa fa-mail-forward"></i>
          </button>
        </div>
      );
    }
  });

  return BaseSelectionActions;
});
