define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var TypeMap = require('./type-map');
  var BaseSelectionActions = require('jsx!./base-selection-actions');

  var SelectionToolbar = React.createClass({
    createAction: function(actionClass, key) {
      var selectedItem = this.getSelectedItem();
      var selectedItemFirebaseRef = this.props.firebaseRef
        .child(this.props.selectedItem).child('props');
      return React.createElement(
        actionClass,
        _.extend({
          key: key,
          ref: actionClass.refName,
          itemType: selectedItem.type
        }, TypeMap[selectedItem.type].DEFAULT_PROPS, selectedItem.props, {
          allItems: this.props.items,
          firebaseRef: selectedItemFirebaseRef
        })
      );
    },
    getActionClasses: function() {
      return [BaseSelectionActions]
        .concat(TypeMap[this.getSelectedItem().type].SelectionActions || []);
    },
    getSelectedItem: function() {
      return this.props.items[this.props.selectedItem];
    },
    render: function() {
      return (
        <div className="selection-toolbar">
          {this.getActionClasses().map(function(actionClass, i) {
             return this.createAction(actionClass, i);
          }, this)}
        </div>
      );
    }
  });

  return SelectionToolbar;
});
