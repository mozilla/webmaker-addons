define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var SelectionFrame = require('jsx!./selection-frame');
  var Fonts = require('jsx!./fonts');
  var ExportModal = require('jsx!./export-modal');

  var TypeMap = {
    image: require('jsx!./movable-image'),
    text: require('jsx!./movable-text')
  };

  var RemoveButton = React.createClass({
    handleClick: function() {
      this.props.firebaseRef.parent().remove();
    },
    render: function() {
      return (
        <button className="btn btn-default" onClick={this.handleClick}>
          <i className="fa fa-trash"></i>
        </button>
      );
    }
  });

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
      var items = snapshot.val();
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
            {Fonts.createLinkElements(this.getFontList(), 'https:')}
          </head>
          <body>
            {this.createItems()}
          </body>
        </html>
      );
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
    createItems: function() {
      var items = this.state.items || {};
      var itemsRef = this.props.firebaseRef;

      return (
        <div style={{position: 'relative'}}>
        {Object.keys(items).map(function(key) {
          var item = items[key];
          if (item && item.type && item.type in TypeMap)
            return React.createElement(
              TypeMap[item.type].ContentItem,
              _.extend({}, item.props, {
                key: key,
                onSelect: this.handleItemSelect.bind(this, key),
                firebaseRef: itemsRef.child(key).child('props')
              })
            );
          return <div key={key}><code>??? {key} ???</code></div>;
        }, this)}
        </div>
      );
    },
    createSelectionToolbar: function() {
      if (!this.state.selectedItem) return null;

      var key = this.state.selectedItem;
      var firebaseRef = this.props.firebaseRef.child(key).child('props');
      var item = this.state.items[key];
      var actions = [RemoveButton]
        .concat(TypeMap[item.type].SelectionActions || [])
        .map(function(componentClass, i) {
          var component = React.createElement(
            componentClass,
            _.extend({}, item.props, {
              firebaseRef: firebaseRef
            })
          );
          return <li key={i}>{component}</li>;
        });

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
    getFontList: function() {
      return _.unique(_.values(this.state.items).filter(function(item) {
        return item.props && item.props.fontFamily;
      }).map(function(item) {
        return item.props.fontFamily;
      }));
    },
    render: function() {
      return (
        <div>
          {this.createPrimaryToolbar()}
          {this.createItems()}
          <SelectionFrame selection={this.state.selectedItemDOMNode}/>
          <Fonts fonts={this.getFontList()}/>
          {this.createSelectionToolbar()}
          {this.createExportModal()}
        </div>
      );
    }
  });

  return App;
});
