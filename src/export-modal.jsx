define(function(require) {
  var React = require('react');
  var Modal = require('jsx!./modal');

  var Export = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    // Extremely primitive "pretty printer" that just adds line breaks
    // after every HTML tag.
    prettifyHtml: function(html) {
      var parts = [];
      var indent = 0;
      for (var i = 0; i < html.length; i++) {
        parts.push(html[i]);
        if (html[i] == '>') parts.push('\n');
      }
      return parts.join('');
    },
    handleChange: function() {
      // Do nothing. This just prevents React from raising a warning about
      // this field not having an onChange handler. We don't want to set
      // the textarea to readonly (which would also prevent the warning)
      // because that would prevent the text from being selectable.
    },
    createDataURL: function(html) {
      return 'data:text/html;base64,' + btoa(html);
    },
    render: function() {
      var html = this.prettifyHtml(this.props.html);
      return (
        <Modal title="Export to HTML" onClose={this.props.onClose}>
          <div className="modal-body">
            <p>Here is the HTML for your awesome thing. You can copy and paste it into an editor like <a href="https://thimble.webmaker.org" target="_blank">Thimble</a>, or open it in a <a href={this.createDataURL(html)} target="_blank">new tab</a>.</p>
            <textarea className="form-control" rows="10" style={{
              fontFamily: 'monospace'
            }} spellCheck="false" value={html} onChange={this.handleChange}></textarea>
          </div>
        </Modal>
      );
    }
  });

  return Export;
});
