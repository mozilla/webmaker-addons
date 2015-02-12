define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var TypeMap = require('./type-map');

  var SelectionModal = React.createClass({
    createModal: function(modalClass) {
      var selectedItem = this.getSelectedItem();
      var selectedItemFirebaseRef = this.props.firebaseRef
        .child(this.props.selectedItem).child('props');
      return React.createElement(
        modalClass,
        _.extend({
          dismissModal: this.props.dismissModal,
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
      return (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          width: '100%',
          height: '100%'
        }}>
          <div style={{pointerEvents: 'auto'}}>
            {this.createModal(this.props.modalClass)}
          </div>
        </div>
      );
    }
  });

  return SelectionModal;
});
