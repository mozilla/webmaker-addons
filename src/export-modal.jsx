define(function(require) {
  var React = require('react');
  var Modal = require('jsx!./modal');
  var PNGExport = require('./png-export');

  var Export = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getInitialState: function() {
      return {
        show: 'choices'
      };
    },
    componentWillUnmount: function() {
      if (this.state.pngURL) {
        URL.revokeObjectURL(this.state.pngURL);
      }
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
    handleExportToPNG: function(e) {
      e.preventDefault();
      this.setState({show: 'exportingToPNG'});
      PNGExport.export({
        items: this.props.items,
        html: this.props.html
      }, function(err, pngBlob) {
        if (err) {
          window.alert("Sorry, an error occurred while exporting " +
                       "to PNG. Please try again later.");
          return this.props.onClose();
        }
        this.setState({
          show: 'exportedToPNG',
          pngURL: URL.createObjectURL(pngBlob)
        });
      }.bind(this));
    },
    createDataURL: function(html) {
      return PNGExport.htmlToDataURL(html);
    },
    showHandlerFor: function(showValue) {
      return function() {
        this.setState({show: showValue});
      }.bind(this);
    },
    handleNotImplemented: function() {
      window.alert("Sorry, this feature hasn't been implemented yet.");
    },
    render: function() {
      var show = this.state.show;
      var html, content;

      if (show == "choices") {
        content = (
          <div>
            <h2>Share as Image</h2>
            <div>
              <button onClick={this.handleNotImplemented}><i className="fa fa-facebook-square"/></button>
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
            <p>Drag the image to your desktop to save it.</p>
            <p>Drag it back here anytime to remix your creation.</p>
            <img style={{width: '100%'}} src={this.state.pngURL}/>
          </div>
        );
      } else if (show == "html") {
        html = this.prettifyHtml(this.props.html);
        content = (
          <div>
            <p><strong>Here is the HTML for your awesome thing.</strong></p>
            <p>You can copy and paste it into an editor like <a href="https://thimble.webmaker.org" target="_blank">Thimble</a>, or open it in a <a href={this.createDataURL(html)} target="_blank">new tab</a>.</p>
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
