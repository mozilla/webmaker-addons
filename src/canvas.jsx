define(function(require) {
  var React = require('react');
  var TypeMap = require('./type-map');
  var itemUtils = require('./item-utils');

  var Canvas = React.createClass({
    createItem: function(key) {
      var isEditable = this.props.isEditable;
      var isSelected = isEditable && this.props.selectedItem == key;
      var item = this.props.items[key];
      var editableOptions;

      if (item && item.type && item.type in TypeMap) {
        if (isEditable)
          editableOptions = {
            ref: isSelected ? 'selectedItem' : undefined,
            isEditable: true,
            isSelected: isSelected,
            getPointerScale: this.props.getPointerScale,
            onSelect: this.props.onItemSelect.bind(null, key),
            firebaseRef: this.props.firebaseRef.child(key).child('props')
          };

        return React.createElement(
          TypeMap[item.type].ContentItem,
          _.extend({}, TypeMap[item.type].DEFAULT_PROPS, item.props, {
            key: key
          }, editableOptions || {})
        );
      }
      return <div key={key}><code>??? {key} ???</code></div>;
    },
    handleClick: function(e) {
      if (e.target === e.currentTarget)
        this.props.onClearSelection();
    },
    render: function() {
      var orderedKeys = itemUtils.getOrderedKeys(this.props.items || {});

      return (
        <div style={{
          position: 'relative',
          width: this.props.canvasWidth,
          height: this.props.canvasHeight,
          border: '1px dotted lightgray',
          overflow: 'hidden'
        }} onClick={this.handleClick} onTouchStart={this.handleClick}>
        {orderedKeys.map(this.createItem)}
        </div>
      );
    }
  });

  return Canvas;
});
