define(function(require) {
  var React = require('react');
  var MovableImage = require('jsx!./movable-image');

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
        url: url,
        x: 0,
        y: 0
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
          return <MovableImage key={key} item={items[key]} firebaseRef={itemsRef.child(key)}/>;
        })}
        </div>
      );
    },
    render: function() {
      return (
        <div>
          <ul className="list-inline">
            <li><button className="btn btn-default" onClick={this.handleAddImage}><i className="fa fa-image"></i> </button></li>
            <li><button className="btn btn-default" onClick={this.handleExport}><i className="fa fa-download"></i></button></li>
          </ul>
          {this.createItems()}
        </div>
      );
    }
  });

  return App;
});
