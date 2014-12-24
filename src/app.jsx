define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var SelectionFrame = require('jsx!./selection-frame');

  var TypeMap = {
    image: require('jsx!./movable-image'),
    text: require('jsx!./movable-text')
  };

  var RemoveButton = React.createClass({
    handleClick: function() {
      this.props.firebaseRef.remove();
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
    handleExport: function() {
      var html = React.renderToStaticMarkup(this.createItems());
      window.open('data:text/html;base64,' + btoa(html));
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

      var firebaseRef = this.props.firebaseRef.child(this.state.selectedItem);

      return (
        <div className="container" style={{
          position: 'fixed',
          bottom: 0,
          left: 0
        }}>
          <ul className="list-inline">
            <li><RemoveButton firebaseRef={firebaseRef}/></li>
          </ul>
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
          <li><button className="btn btn-default" onClick={this.handleExport}>
            <i className="fa fa-download"></i>
          </button></li>
        </ul>
      );
    },
    render: function() {
      return (
        <div>
          {this.createPrimaryToolbar()}
          {this.createItems()}
          <SelectionFrame selection={this.state.selectedItemDOMNode}/>
          {this.createSelectionToolbar()}
        </div>
      );
    }
  });

  return App;
});
