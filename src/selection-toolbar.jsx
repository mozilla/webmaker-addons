define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var TypeMap = require('./type-map');

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
          showModal: this.props.showModal,
          currentModal: this.props.currentModal,
          itemType: selectedItem.type
        }, TypeMap[selectedItem.type].DEFAULT_PROPS, selectedItem.props, {
          allItems: this.props.items,
          firebaseRef: selectedItemFirebaseRef
        })
      );
    },
    getSelectedItem: function() {
      return this.props.items[this.props.selectedItem];
    },
    render: function() {
      var actionClasses = this.props.actionClasses ||
        TypeMap[this.getSelectedItem().type].SelectionActions || [];

      return (
        <div className={"selection-toolbar " + (this.props.className || '')}>
          {actionClasses.map(function(actionClass, i) {
             return this.createAction(actionClass, i);
          }, this)}
        </div>
      );
    }
  });

  return SelectionToolbar;
});
