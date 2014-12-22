define(function(require) {
  var React = require('react');

  var Item = React.createClass({
    handleClick: function() {
      this.props.firebaseRef.set(this.props.item + 1);
    },
    render: function() {
      return <button className="btn btn-default" onClick={this.handleClick}>{this.props.item}</button>;
    }
  });

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
    render: function() {
      var items = this.state.items || {};
      var itemsRef = this.props.firebaseRef;
      return (
        <div>
          {Object.keys(items).map(function(key) {
            return <Item key={key} item={items[key]} firebaseRef={itemsRef.child(key)}/>;
          })}
        </div>
      );
    }
  });

  return App;
});
