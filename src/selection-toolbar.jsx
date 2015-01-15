define(function(require) {
  var React = require('react');
  var TypeMap = require('./type-map');
  var BaseSelectionActions = require('jsx!./base-selection-actions');

  var SelectionToolbar = React.createClass({
    render: function() {
      if (!this.props.selectedItem) return null;

      var key = this.props.selectedItem;
      var firebaseRef = this.props.firebaseRef.child(key).child('props');
      var item = this.props.items[key];
      var actions = [BaseSelectionActions]
        .concat(TypeMap[item.type].SelectionActions || [])
        .map(function(componentClass, i) {
          var component = React.createElement(
            componentClass,
            _.extend({
              itemType: item.type
            }, TypeMap[item.type].DEFAULT_PROPS, item.props, {
              allItems: this.props.items,
              firebaseRef: firebaseRef
            })
          );
          return <li key={i}>{component}</li>;
        }, this);

      return (
        <div className="container" style={{
          position: 'fixed',
          bottom: 0,
          left: 0
        }}>
          <ul className="list-inline">{actions}</ul>
        </div>
      );
    }
  });

  return SelectionToolbar;
});
