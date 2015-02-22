define(function(require) {
  var _ = require('underscore');
  var React = require('react');

  var DownloadableBlobImage = React.createClass({
    getInitialState: function() {
      return {
        url: URL.createObjectURL(this.props.blob)
      };
    },
    componentWillReceiveProps: function(nextProps) {
      if (nextProps.blob !== this.props.blob) {
        this.startReadingBlob(nextProps.blob);
        URL.revokeObjectURL(this.state.url);
        this.setState({
          url: URL.createObjectURL(this.props.blob)
        });
      }
    },
    componentWillMount: function() {
      this.startReadingBlob(this.props.blob);
    },
    componentWillUnmount: function() {
      URL.revokeObjectURL(this.state.url);
    },
    startReadingBlob: function(blob) {
      this.dataURL = null;
      this.reader = new FileReader();
      this.reader.onload = this.handleBlobReaderLoad;
      this.reader.readAsBinaryString(blob);
    },
    handleBlobReaderLoad: function(e) {
      if (e.target !== this.reader) return;
      this.dataURL = 'data:image/png;base64,' + btoa(this.reader.result);
    },
    handleDragStart: function(e) {
      var dt = e.dataTransfer;
      dt.effectAllowed = 'copy';

      // Gmail, at the very least, likes text/html with
      // Data URLs in it and rejects Blob URLs, so we
      // prefer to export that.
      if (this.dataURL)
        dt.setData('text/html', '<img src="' + this.dataURL + '">');

      // Chrome will use this to support dragging the image
      // to the desktop. Unfortunately, there doesn't seem
      // to be a way to do anything analogous in Firefox.
      dt.setData('DownloadURL', [
        'image/png',
        this.props.downloadFilename,
        this.state.url
      ].join(':'));
    },
    render: function() {
      return (
        <a className={this.props.className}
           href={this.state.url}
           draggable="true"
           onDragStart={this.handleDragStart}
           download={this.props.downloadFilename}>
          <img src={this.state.url}
               draggable="true"
               onDragStart={this.handleDragStart}/>
        </a>
      );
    }
  });

  return DownloadableBlobImage;
});
