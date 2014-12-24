define(function(require) {
  var React = require('react');
  var Movable = require('./movable');

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
    handleImageLoad: function(e) {
      var img = e.target;
      this.props.firebaseRef.push({
        type: 'image',
        props: {
          url: img.src,
          height: img.naturalHeight,
          width: img.naturalWidth,
          x: 0,
          y: 0
        }
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

  var MovableImage = React.createClass({
    mixins: [Movable],
    render: function() {
      return <img style={this.getMovingStyle()} src={this.props.url} width={this.props.width} height={this.props.height}/>;
    }
  });

  return {
    AddButton: AddImageButton,
    ContentItem: MovableImage
  };
});
