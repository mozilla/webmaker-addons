define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var Movable = require('./movable');
  var Fonts = require('./fonts');
  var ColorWidget = require('jsx!./colors/widget');

  var DEFAULT_PROPS = {
    fontFamily: window.DEFAULT_FONT,
    fontSize: 32,
    color: 'white'
  };

  var AddTextButton = React.createClass({
    handleClick: function() {
      var newRef = this.props.firebaseRef.push({
        type: 'text',
        props: _.extend({
          text: "Change me!",
          x: 0,
          y: 0
        }, DEFAULT_PROPS)
      });
      this.props.selectItem(newRef.key(), {
        modalClass: TextModal
      });
      this.getDOMNode().blur();
    },
    render: function() {
      return (
        <button onClick={this.handleClick}>
          <img src="src/icons/TextIcon.svg"/>
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
      return (
        <div className="input-group">
          <label>Text</label>
          <input title="Text to display" type="text" value={this.props.text} onChange={this.handleChange} placeholder="text"/>
        </div>
      );
    }
  });

  var ChangeFontFamilyField = React.createClass({
    handleChange: function(e) {
      this.props.firebaseRef.update({
        fontFamily: e.target.value
      });
    },
    render: function() {
      return (
        <div className="input-group">
          <label>Font</label>
          <select title="Font family" value={this.props.fontFamily} onChange={this.handleChange}>
            {Fonts.getAvailable().map(function(family) {
              return <option key={family} value={family}>{family}</option>
            })}
          </select>
        </div>
      );
    }
  });

  var SimpleChangeFontFamilyField = React.createClass({
    render: function() {
      return (
        <button>
          <img src="src/icons/FontIcon.svg"/>
        </button>
      );
    }
  });

  var SimpleChangeColorField = React.createClass({
    render: function() {
      return (
        <button>
          <img src="src/icons/ColorIcon.svg"/>
        </button>
      );
    }
  });

  var TextModal = React.createClass({
    getInitialState: function() {
      return {
        initialText: this.props.text
      };
    },
    componentDidMount: function() {
      this.refs.text.getDOMNode().select();
    },
    handleSubmit: function(e) {
      e.preventDefault();
      if (!this.props.text)
        return this.props.firebaseRef.parent().remove();
      this.props.dismissModal();
    },
    handleChange: function(e) {
      this.props.firebaseRef.update({
        text: e.target.value
      });
    },
    handleCancel: function(e) {
      e.preventDefault();
      this.props.firebaseRef.update({
        text: this.state.initialText
      });
      this.props.dismissModal();
    },
    render: function() {
      return (
        <div style={{position: 'absolute', bottom: 0, left: 0, color: 'pink', fontSize: 24}}>
          <form onSubmit={this.handleSubmit}>
            <input type="text" ref="text" value={this.props.text} onChange={this.handleChange}/>
            <button type="submit">ok</button>
            <button onClick={this.handleCancel}>cancel</button>
          </form>
        </div>
      );
    }
  });

  var SimpleChangeTextField = React.createClass({
    handleClick: function(e) {
      return this.props.showModal(TextModal);
    },
    render: function() {
      return (
        <button onClick={this.handleClick}>
          <img src="src/icons/TextIcon.svg"/>
        </button>
      );
    }
  });

  var ChangeFontSizeField = React.createClass({
    handleChange: function(e) {
      this.props.firebaseRef.update({
        fontSize: parseInt(e.target.value)
      });
    },
    render: function() {
      return (
        <div className="input-group">
          <label>Font Size</label>
          <input title={"Font size: " + this.props.fontSize + "px"} type="range" min="8" max="100" step="1" value={this.props.fontSize} onChange={this.handleChange}/>
          <span className="text">{this.props.fontSize + "px"}</span>
        </div>
      );
    }
  });

  var ChangeColorField = React.createClass({
    handleChange: function(e) {
      this.props.firebaseRef.update({
        color: e.target.value
      });
    },
    render: function() {
      return <ColorWidget title="Text color" value={this.props.color} onChange={this.handleChange}/>
    }
  });

  return {
    DEFAULT_PROPS: DEFAULT_PROPS,
    AddButton: AddTextButton,
    ContentItem: MovableText,
    SelectionActions: window.SIMPLE_MODE ? [
      SimpleChangeColorField,
      SimpleChangeFontFamilyField,
      SimpleChangeTextField
    ] : [
      ChangeTextField,
      ChangeFontFamilyField,
      ChangeFontSizeField,
      ChangeColorField
    ]
  }
});
