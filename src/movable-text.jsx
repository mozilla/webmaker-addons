define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var Movable = require('./movable');
  var Fonts = require('./fonts');
  var ColorWidget = require('jsx!./colors/widget');

  var DEFAULT_PROPS = {
    fontFamily: window.DEFAULT_FONT,
    fontSize: 18,
    color: 'black'
  };

  var AddTextButton = React.createClass({
    handleClick: function() {
      var text = window.prompt("Gimme some text.");
      if (!text) return;
      this.props.firebaseRef.push({
        type: 'text',
        props: _.extend({
          text: text,
          x: 0,
          y: 0
        }, DEFAULT_PROPS)
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
        color: this.props.color,
        fontSize: this.props.fontSize,
        fontFamily: this.props.fontFamily
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
      return <input title="Text to display" type="text" className="form-control" value={this.props.text} onChange={this.handleChange} placeholder="text"/>;
    }
  });

  var ChangeFontFamilyField = React.createClass({
    handleChange: function(e) {
      this.props.firebaseRef.update({
        fontFamily: e.target.value
      });
    },
    render: function() {
      return <select title="Font family" className="form-control" value={this.props.fontFamily} onChange={this.handleChange}>
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
      return <input title={"Font size: " + this.props.fontSize + "px"} type="range" min="8" max="60" step="1" value={this.props.fontSize} onChange={this.handleChange}/>
    }
  });

  var ChangeColorField = React.createClass({
    handleChange: function(e) {
      this.props.firebaseRef.update({
        color: e.target.value
      });
    },
    render: function() {
      return <ColorWidget title="Text color" className="form-control" value={this.props.color} onChange={this.handleChange}/>
    }
  });

  return {
    DEFAULT_PROPS: DEFAULT_PROPS,
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
