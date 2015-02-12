define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var Movable = require('./movable');

  var DEFAULT_PROPS = {
    scale: 100
  };

  var AddImageButton = React.createClass({
    handleClick: function() {
      this.addImage(window.prompt("Gimme an image URL."));
    },
    addImage: function(url, cb) {
      if (!url) return;
      if (!/^https?:\/\//.test(url))
        return window.alert("Invalid URL!");
      var img = document.createElement('img');

      cb = cb || function(err, newRef, img) {
        if (err)
          window.alert("Sorry, an error occurred loading the image.");
        this.props.selectItem(newRef.key());
      }.bind(this);

      img.onload = this.handleImageLoad.bind(this, cb);
      img.onerror = cb;
      img.setAttribute('src', url);
      this.getDOMNode().blur();
      // TODO: Show some kind of throbber, etc.
    },
    scaleToFit: function(width, height) {
      var maxWidth = this.props.canvasWidth;
      var maxHeight = this.props.canvasHeight;

      if (width <= maxWidth && height <= maxHeight)
        return 100;
      if (width > height) {
        return Math.floor(maxWidth / width * 100);
      } else {
        return Math.floor(maxHeight / height * 100);
      }
    },
    handleImageLoad: function(cb, e) {
      var img = e.target;
      var scale = this.scaleToFit(img.naturalWidth, img.naturalHeight);
      var newRef = this.props.firebaseRef.push({
        type: 'image',
        props: _.extend({}, DEFAULT_PROPS, {
          url: img.src,
          height: img.naturalHeight,
          width: img.naturalWidth,
          scale: scale,
          x: 0,
          y: 0
        })
      });

      cb(null, newRef, img);
    },
    render: function() {
      return (
        <button onClick={this.handleClick} style={{
          display: window.EMBEDDED_MODE ? 'none' : undefined
        }}>
          <i className="fa fa-image"></i>
        </button>
      );
    }
  });

  var ChangeScaleField = React.createClass({
    handleChange: function(e) {
      this.props.firebaseRef.update({
        scale: parseInt(e.target.value)
      });
    },
    render: function() {
      return (
        <div className="input-group">
          <label>Scale</label>
          <input title={"Image scale: " + this.props.scale + "%"} type="range" min="1" max="100" step="1" value={this.props.scale} onChange={this.handleChange}/>
          <span className="text">{this.props.scale + "%"}</span>
        </div>
      );
    }
  });

  var MovableImage = React.createClass({
    mixins: [Movable],
    render: function() {
      var scale = this.props.scale / 100;
      var width = Math.floor(this.props.width * scale);
      var height = Math.floor(this.props.height * scale);

      return <img style={this.getMovingStyle()} src={this.props.url} width={width} height={height}/>;
    }
  });

  return {
    DEFAULT_PROPS: DEFAULT_PROPS,
    AddButton: AddImageButton,
    ContentItem: MovableImage,
    SelectionActions: window.SIMPLE_MODE ? [
    ] : [
      ChangeScaleField
    ]
  };
});
