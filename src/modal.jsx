define(function(require) {
  var React = require('react');

  var Modal = React.createClass({
    componentDidMount: function() {
      this.backdrop = document.createElement('div');
      this.backdrop.setAttribute('class', 'modal-backdrop in');
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
        <div className="modal" style={{display: 'block'}} onClick={this.handleClick}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button onClick={this.props.onClose} type="button" className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">{this.props.title}</h4>
              </div>
              {this.props.children}
            </div>
          </div>
        </div>
      );
    }
  });

  return Modal;
});
