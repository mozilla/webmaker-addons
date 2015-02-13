define(function(require) {
  var React = require('react');

  var Modal = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    componentDidMount: function() {
      this.backdrop = document.createElement('div');
      this.backdrop.setAttribute('class', 'modal-backdrop');
      document.body.appendChild(this.backdrop);
    },
    componentWillUnmount: function() {
      document.body.removeChild(this.backdrop);
      this.backdrop = null;
    },
    handleClick: function(e) {
      if (e.target === this.getDOMNode())
        this.props.onClose();
    },
    render: function() {
      return (
        <div className="modal" onClick={this.handleClick}>
          <div className="modal-dialog">
            {this.props.children}
          </div>
        </div>
      );
    }
  });

  return Modal;
});
