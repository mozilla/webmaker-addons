define(function(require) {
  var _ = require('underscore');
  var React = require('react');

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
      if (!/^https?:\/\//.test(url)) return;
      this.props.firebaseRef.push({
        type: 'image',
        props: {
          url: url,
          x: 0,
          y: 0
        }
      });
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
                firebaseRef: itemsRef.child(key).child('props')
              })
            );
          return <div key={key}><code>??? {key} ???</code></div>;
        })}
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
        </div>
      );
    }
  });

  return App;
});
