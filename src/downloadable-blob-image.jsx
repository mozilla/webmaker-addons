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
        URL.revokeObjectURL(this.state.url);
        this.setState({
          url: URL.createObjectURL(this.props.blob)
        });
      }
    },
    componentWillUnmount: function() {
      URL.revokeObjectURL(this.state.url);
    },
    render: function() {
      return (
        <a className={this.props.className}
           href={this.state.url}
           download={this.props.downloadFilename}>
          <img src={this.state.url}/>
        </a>
      );
    }
  });

  return DownloadableBlobImage;
});
