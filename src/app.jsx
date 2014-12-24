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

  var AddImageButton = React.createClass({
    handleClick: function() {
      var url = window.prompt("Gimme an image URL.");
      if (!url) return;
      if (!/^https?:\/\//.test(url))
        return window.alert("Invalid URL!");
      var img = document.createElement('img');
      img.onload = this.handleImageLoad;
      img.onerror = this.handleImageError;
      img.setAttribute('src', url);
      // TODO: Show some kind of throbber, etc.
    },
    handleImageLoad: function(e) {
      var img = e.target;
      this.props.firebaseRef.push({
        type: 'image',
        props: {
          url: img.src,
          height: img.naturalHeight,
          width: img.naturalWidth,
          x: 0,
          y: 0
        }
      });
    },
    handleImageError: function() {
      window.alert("Sorry, an error occurred loading the image.");
    },
    render: function() {
      return (
        <button className="btn btn-default" onClick={this.handleClick}>
          <i className="fa fa-image"></i>
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
    handleAddText: function() {
      var text = window.prompt("Gimme some text.");
      if (!text) return;
      this.props.firebaseRef.push({
        type: 'text',
        props: {
          text: text,
          x: 0,
          y: 0
        }
      });
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
              TypeMap[item.type],
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
    render: function() {
      return (
        <div>
          <ul className="list-inline">
            <li><AddImageButton firebaseRef={this.props.firebaseRef}/></li>
            <li><button className="btn btn-default" onClick={this.handleAddText}>
              <i className="fa fa-font"></i>
            </button></li>
            <li><button className="btn btn-default" onClick={this.handleExport}>
              <i className="fa fa-download"></i>
            </button></li>
          </ul>
          {this.createItems()}
          <SelectionFrame selection={this.state.selectedItemDOMNode}/>
          {this.createSelectionToolbar()}
        </div>
      );
    }
  });

  return App;
});
