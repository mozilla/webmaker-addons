define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var SelectionFrame = require('jsx!./selection-frame');

  var TypeMap = {
    image: require('jsx!./movable-image'),
    text: require('jsx!./movable-text')
  };

  var App = React.createClass({
    getInitialState: function() {
      return {
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
      this.setState({items: snapshot.val()});
    },
    handleAddImage: function() {
      var url = window.prompt("Gimme an image URL.");
      if (!url) return;
      if (!/^https?:\/\//.test(url))
        return window.alert("Invalid URL!");
      var img = document.createElement('img');
      img.onload = function() {
        this.props.firebaseRef.push({
          type: 'image',
          props: {
            url: url,
            height: img.naturalHeight,
            width: img.naturalWidth,
            x: 0,
            y: 0
          }
        });
      }.bind(this);
      img.onerror = function() {
        window.alert("Sorry, an error occurred loading the image.");
      };
      img.setAttribute('src', url);
      // TODO: Show some kind of throbber, etc.
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
    handleItemSelect: function(e) {
      this.refs.selection.select(e.target);
    },
    clearSelection: function(e) {
      this.refs.selection.select(null);
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
                onSelect: this.handleItemSelect,
                firebaseRef: itemsRef.child(key).child('props')
              })
            );
          return <div key={key}><code>??? {key} ???</code></div>;
        }, this)}
        </div>
      );
    },
    render: function() {
      return (
        <div>
          <ul className="list-inline">
            <li><button className="btn btn-default" onClick={this.handleAddImage}><i className="fa fa-image"></i> </button></li>
            <li><button className="btn btn-default" onClick={this.handleAddText}><i className="fa fa-font"></i> </button></li>
            <li><button className="btn btn-default" onClick={this.handleExport}><i className="fa fa-download"></i></button></li>
          </ul>
          {this.createItems()}
          <SelectionFrame ref="selection"/>
        </div>
      );
    }
  });

  return App;
});
