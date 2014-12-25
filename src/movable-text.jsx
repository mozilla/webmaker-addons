define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var Movable = require('./movable');

  var AddTextButton = React.createClass({
    handleClick: function() {
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
    render: function() {
      return (
        <button className="btn btn-default" onClick={this.handleClick}>
          <i className="fa fa-font"></i>
        </button>        
      );
    }
  });

  var MovableText = React.createClass({
    mixins: [Movable],
    render: function() {
      var style = _.extend({
        background: 'rgba(255, 255, 255, 0.5)',
        padding: 10,
        fontFamily: this.props.fontFamily || 'sans-serif'
      }, this.getMovingStyle());

      return <span ref="text" style={style}>{this.props.text}</span>;
    }
  });

  var ChangeTextField = React.createClass({
    handleChange: function(e) {
      this.props.firebaseRef.update({
        text: e.target.value
      });
    },
    render: function() {
      return <input type="text" className="form-control" value={this.props.text} onChange={this.handleChange} placeholder="text"/>;
    }
  });

  return {
    AddButton: AddTextButton,
    ContentItem: MovableText,
    SelectionActions: [
      ChangeTextField
    ]
  }
});
