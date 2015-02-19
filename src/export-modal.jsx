define(function(require) {
  var React = require('react');
  var Modal = require('jsx!./modal');
  var PNGExport = require('./png-export');
  var DownloadableBlobImage = require('jsx!./downloadable-blob-image');
  var KeypressMixin = require('./keypress-mixin');

  var Export = React.createClass({
    mixins: [React.addons.PureRenderMixin, KeypressMixin],
    getInitialState: function() {
      return {
        show: 'choices',
        pngBlob: null
      };
    },
    // Extremely primitive "pretty printer" that just adds line breaks
    // after every HTML tag.
    prettifyHtml: function(html) {
      var parts = [];
      var indent = 0;
      for (var i = 0; i < html.length; i++) {
        parts.push(html[i]);
        if (html[i] == '>') parts.push('\n');
      }
      return parts.join('').slice(0, -1);
    },
    handleChange: function() {
      // Do nothing. This just prevents React from raising a warning about
      // this field not having an onChange handler. We don't want to set
      // the textarea to readonly (which would also prevent the warning)
      // because that would prevent the text from being selectable.
    },
    handleKeypress: function(keyCode) {
      if (keyCode == this.KEY_ESC)
        this.props.onClose();
    },
    handleExportToPNG: function(e) {
      e.preventDefault();
      this.exportToPNG(function(pngBlob) {
        this.setState({
          show: 'exportedToPNG',
          pngBlob: pngBlob
        });
      });
    },
    exportToPNG: function(cb) {
      this.setState({show: 'exportingToPNG'});
      PNGExport.export({
        items: this.props.items,
        html: this.props.html
      }, function(err, pngBlob) {
        if (!this.isMounted()) return;
        if (err) {
          window.alert("Sorry, an error occurred while exporting " +
                       "to PNG. Please try again later.");
          return this.props.onClose();
        }
        cb.call(this, pngBlob);
      }.bind(this));
    },
    showHandlerFor: function(showValue) {
      return function() {
        this.setState({show: showValue});
      }.bind(this);
    },
    handleUploadToCloud: function() {
      this.setState({show: 'uploadingToCloud'});
      this.exportToPNG(function(pngBlob) {
        this.props.onClose();

        // We only need to keep the blob URL around long enough
        // for the upload page to read its data.
        var BLOB_URL_EXPIRY_MS = 300 * 1000;

        var blobURL = URL.createObjectURL(pngBlob);
        var a = document.createElement('a');
        a.setAttribute('href',
                       'upload.html?blob=' + encodeURIComponent(blobURL));
        window.setTimeout(function() {
          URL.revokeObjectURL(blobURL);
        }, BLOB_URL_EXPIRY_MS);
        if (window.parent !== window) {
          // We might be in an add-on sidebar, so tell it to open the
          // URL in a new tab.
          window.parent.postMessage(JSON.stringify({
            type: 'openURL',
            url: a.href
          }), '*');
        }
        window.open(a.href);
      });
    },
    componentWillMount: function() {
      if (window.DISABLE_WEBMAKER)
        this.handleUploadToCloud();
    },
    render: function() {
      var show = this.state.show;
      var html, content;

      if (show == "choices") {
        content = (
          <div>
            <h2>Share as Image</h2>
            <div>
              <button onClick={this.handleUploadToCloud}><i className="fa fa-cloud-upload"/></button>
              <button onClick={this.handleExportToPNG}><i className="fa fa-download"/></button>
            </div>
            <h2>Share as Page</h2>
            <div>
              <button onClick={this.showHandlerFor('html')}><img src="src/icons/WebmakerIcon.svg"/></button>
            </div>
          </div>
        );
      } else if (show == "exportingToPNG") {
        content = <i style={{
          fontSize: 64, padding: 16
        }} className="fa fa-spin fa-circle-o-notch"/>
      } else if (show == "exportedToPNG") {
        content = (
          <div>
            <p><strong>Here is the PNG of your awesome thing.</strong></p>
            <p>Click the image to save it.</p>
            <p>Drag it back here anytime to remix your creation.</p>
            <DownloadableBlobImage
             className="exported-image"
             downloadFilename="my-awesome-thing.png"
             blob={this.state.pngBlob}/>
          </div>
        );
      } else if (show == "html") {
        html = this.prettifyHtml(this.props.html);
        content = (
          <div>
            <p><strong>Here is the HTML for your awesome thing.</strong></p>
            <p>You can copy and paste it into an editor like <a
              href="https://thimble.webmaker.org" target="_blank">Thimble</a>
            , or open it in a <a
              href={PNGExport.htmlToDataURL(html)} target="_blank">new tab</a>.</p>
            <textarea rows="10" spellCheck="false" value={html} onChange={this.handleChange}></textarea>
          </div>
        );
      }

      return (
        <Modal title="Export" onClose={this.props.onClose}>
          <div className="modal-body share-modal">
          {content}
          </div>
        </Modal>
      );
    }
  });

  return Export;
});
