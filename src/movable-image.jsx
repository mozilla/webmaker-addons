define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var Movable = require('./movable');

  var DEFAULT_PROPS = {
    scale: 100
  };

  var AddImageButton = React.createClass({
    handleClick: function() {
      var url = window.prompt("Gimme an image URL.");
      if (!url) return;
      if (!/^https?:\/\//.test(url))
        return window.alert("Invalid URL!");
      var img = document.createElement('img');
      img.onload = this.handleImageLoad;
      img.onerror = this.handleImageError;
      img.setAttribute('src', url);
      // TODO: Show some kind of throbber, etc.
    },
    scaleToFit: function(width, height, maxWidth, maxHeight) {
      if (width <= maxWidth && height <= maxHeight)
        return 100;
      if (width > height) {
        return Math.floor(maxWidth / width * 100);
      } else {
        return Math.floor(maxHeight / height * 100);
      }
    },
    handleImageLoad: function(e) {
      var img = e.target;
      var scale = this.scaleToFit(img.naturalWidth, img.naturalHeight,
                                  this.props.canvasWidth,
                                  this.props.canvasHeight);

      this.props.firebaseRef.push({
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
    },
    handleImageError: function() {
      window.alert("Sorry, an error occurred loading the image.");
    },
    render: function() {
      return (
        <button className="btn btn-default" onClick={this.handleClick}>
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
      return <input title={"Image scale: " + this.props.scale + "%"} type="range" min="1" max="100" step="1" value={this.props.scale} onChange={this.handleChange}/>
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
    SelectionActions: [
      ChangeScaleField
    ]
  };
});
