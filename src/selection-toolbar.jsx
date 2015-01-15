define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var TypeMap = require('./type-map');
  var BaseSelectionActions = require('jsx!./base-selection-actions');

  var SelectionToolbar = React.createClass({
    createAction: function(actionClass) {
      var selectedItem = this.getSelectedItem();
      var selectedItemFirebaseRef = this.props.firebaseRef
        .child(this.props.selectedItem).child('props');
      return React.createElement(
        actionClass,
        _.extend({
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
      if (!this.props.selectedItem) return null;

      return (
        <div className="container" style={{
          position: 'fixed',
          bottom: 0,
          left: 0
        }}>
          <ul className="list-inline">
            {this.getActionClasses().map(function(actionClass, i) {
               return <li key={i}>{this.createAction(actionClass)}</li>;
            }, this)}
          </ul>
        </div>
      );
    }
  });

  return SelectionToolbar;
});
