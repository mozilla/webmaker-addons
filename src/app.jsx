define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var SelectionFrame = require('jsx!./selection-frame');
  var Fonts = require('jsx!./fonts');
  var ExportModal = require('jsx!./export-modal');
  var BaseSelectionActions = require('jsx!./base-selection-actions');
  var itemUtils = require('./item-utils');

  var TypeMap = {
    image: require('jsx!./movable-image'),
    text: require('jsx!./movable-text')
  };

  var App = React.createClass({
    getInitialState: function() {
      return {
        selectedItem: null,
        selectedItemDOMNode: null,
        showExportModal: false,
        items: null
      };
    },
    componentWillMount: function() {
      this.props.firebaseRef.on("value", this.handleFirebaseRefValue);
    },
    componentWillUnmount: function() {
      this.props.firebaseRef.off("value", this.handleFirebaseRefValue);
    },
    handleFirebaseRefValue: function(snapshot) {
      var items = snapshot.val() || {};
      var selectedItem = this.state.selectedItem;

      if (selectedItem && !(selectedItem in items))
        this.clearSelection();

      this.setState({items: items});
    },
    toggleExportModal: function() {
      this.setState({showExportModal: !this.state.showExportModal});
    },
    getExportHtml: function() {
      return React.renderToStaticMarkup(
        <html>
          <head>
            {Fonts.createLinkElements(itemUtils.getFontList(this.state.items),
                                      'https:')}
          </head>
          <body>
            {this.createItems()}
          </body>
        </html>
      );
    },
    handleItemsFrameClick: function(e) {
      if (e.target === e.currentTarget)
        this.clearSelection();
    },
    handleItemSelect: function(key, e) {
      this.setState({
        selectedItem: key,
        selectedItemDOMNode: e.target
      });
    },
    clearSelection: function() {
      this.setState({
        selectedItem: null,
        selectedItemDOMNode: null
      });
    },
    createItem: function(key) {
      var item = this.state.items[key];
      var itemsRef = this.props.firebaseRef;

      if (item && item.type && item.type in TypeMap)
        return React.createElement(
          TypeMap[item.type].ContentItem,
          _.extend({}, TypeMap[item.type].DEFAULT_PROPS, item.props, {
            key: key,
            onSelect: this.handleItemSelect.bind(this, key),
            firebaseRef: itemsRef.child(key).child('props')
          })
        );
      return <div key={key}><code>??? {key} ???</code></div>;
    },
    createItems: function() {
      var orderedKeys = itemUtils.getOrderedKeys(this.state.items || {});

      return (
        <div style={{
          position: 'relative',
          width: 640,
          height: 480,
          border: '1px dotted lightgray',
          overflow: 'hidden'
        }} onClick={this.handleItemsFrameClick}>
        {orderedKeys.map(this.createItem)}
        </div>
      );
    },
    createSelectionToolbar: function() {
      if (!this.state.selectedItem) return null;

      var key = this.state.selectedItem;
      var firebaseRef = this.props.firebaseRef.child(key).child('props');
      var item = this.state.items[key];
      var actions = [BaseSelectionActions]
        .concat(TypeMap[item.type].SelectionActions || [])
        .map(function(componentClass, i) {
          var component = React.createElement(
            componentClass,
            _.extend({
              itemType: item.type
            }, TypeMap[item.type].DEFAULT_PROPS, item.props, {
              allItems: this.state.items,
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
    },
    createPrimaryToolbar: function() {
      return (
        <ul className="list-inline">
          {Object.keys(TypeMap).map(function(type) {
            var addButton = React.createElement(TypeMap[type].AddButton, {
              firebaseRef: this.props.firebaseRef
            });
            return <li key={type}>{addButton}</li>;
          }, this)}
          <li><button className="btn btn-default" onClick={this.toggleExportModal}>
            <i className="fa fa-download"></i>
          </button></li>
        </ul>
      );
    },
    createExportModal: function() {
      if (!this.state.showExportModal) return null;
      return <ExportModal html={this.getExportHtml()} onClose={this.toggleExportModal}/>;
    },
    render: function() {
      return (
        <div>
          {this.createPrimaryToolbar()}
          {this.createItems()}
          <SelectionFrame selection={this.state.selectedItemDOMNode}/>
          <Fonts fonts={itemUtils.getFontList(this.state.items)}/>
          {this.createSelectionToolbar()}
          {this.createExportModal()}
        </div>
      );
    }
  });

  return App;
});
