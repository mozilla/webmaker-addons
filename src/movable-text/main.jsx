define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var TextModal = require('jsx!./text-modal');
  var FontModal = require('jsx!./font-modal');
  var ColorModal = require('jsx!./color-modal');
  var Movable = require('../movable');
  var Fonts = require('../fonts');
  var ColorWidget = require('jsx!../colors/widget');

  var DEFAULT_PROPS = {
    fontFamily: window.DEFAULT_FONT,
    fontSize: 48,
    color: 'white'
  };

  var AddTextButton = React.createClass({
    addText: function(initialText) {
      return this.props.firebaseRef.push({
        type: 'text',
        props: _.extend({
          text: initialText || "",
          x: 0,
          y: 0
        }, DEFAULT_PROPS)
      });
    },
    handleClick: function() {
      var newRef = this.addText();
      this.props.selectItem({
        key: newRef.key(),
        modalClass: TextModal
      });
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

  var SimpleModalToggler = React.createClass({
    handleClick: function(e) {
      var newModal = this.props.modalClass;
      if (this.props.currentModal === this.props.modalClass)
        newModal = null;
      this.props.showModal(newModal);
    },
    render: function() {
      return (
        <button onClick={this.handleClick}
           className={this.props.currentModal === this.props.modalClass
                      ? "modal-button-enabled"
                      : null}>
          <img src={this.props.imgSrc}/>
        </button>
      );
    }
  });

  var SimpleChangeFontFamilyField = React.createClass({
    render: function() {
      return <SimpleModalToggler showModal={this.props.showModal}
                                 currentModal={this.props.currentModal}
                                 modalClass={FontModal}
                                 imgSrc="src/icons/FontIcon.svg"/>;
    }
  });

  var SimpleChangeColorField = React.createClass({
    render: function() {
      return <SimpleModalToggler showModal={this.props.showModal}
                                 currentModal={this.props.currentModal}
                                 modalClass={ColorModal}
                                 imgSrc="src/icons/ColorIcon.svg"/>;
    }
  });

  var SimpleChangeTextField = React.createClass({
    render: function() {
      return <SimpleModalToggler showModal={this.props.showModal}
                                 currentModal={this.props.currentModal}
                                 modalClass={TextModal}
                                 imgSrc="src/icons/TextIcon.svg"/>;
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
      SimpleChangeTextField,
      ChangeFontSizeField
    ] : [
      ChangeTextField,
      ChangeFontFamilyField,
      ChangeFontSizeField,
      ChangeColorField
    ]
  }
});
