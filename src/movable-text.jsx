define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var Movable = require('./movable');
  var Fonts = require('./fonts');
  var ColorWidget = require('jsx!./colors/widget');

  var AddTextButton = React.createClass({
    handleClick: function() {
      var text = window.prompt("Gimme some text.");
      if (!text) return;
      this.props.firebaseRef.push({
        type: 'text',
        props: {
          fontFamily: 'Open Sans',
          fontSize: 18,
          color: 'black',
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
        color: this.props.color || 'black',
        fontSize: this.props.fontSize || 18,
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

  var ChangeFontFamilyField = React.createClass({
    handleChange: function(e) {
      this.props.firebaseRef.update({
        fontFamily: e.target.value
      });
    },
    render: function() {
      return <select className="form-control" value={this.props.fontFamily} onChange={this.handleChange}>
        {Fonts.getAvailable().map(function(family) {
          return <option key={family} value={family}>{family}</option>
        })}
      </select>
    }
  });

  var ChangeFontSizeField = React.createClass({
    handleChange: function(e) {
      this.props.firebaseRef.update({
        fontSize: parseInt(e.target.value)
      });
    },
    render: function() {
      return <input type="range" min="8" max="60" step="1" value={this.props.fontSize} onChange={this.handleChange}/>
    }
  });

  var ChangeColorField = React.createClass({
    handleChange: function(e) {
      this.props.firebaseRef.update({
        color: e.target.value
      });
    },
    render: function() {
      return <ColorWidget className="form-control" value={this.props.color} onChange={this.handleChange}/>
    }
  });

  return {
    AddButton: AddTextButton,
    ContentItem: MovableText,
    SelectionActions: [
      ChangeTextField,
      ChangeFontFamilyField,
      ChangeFontSizeField,
      ChangeColorField
    ]
  }
});
