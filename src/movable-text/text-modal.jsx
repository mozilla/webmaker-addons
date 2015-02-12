define(function(require) {
  var React = require('react');

  var TextModal = React.createClass({
    getInitialState: function() {
      return {
        initialText: this.props.text
      };
    },
    componentDidMount: function() {
      this.refs.text.getDOMNode().select();
    },
    handleSubmit: function(e) {
      e.preventDefault();
      if (!this.props.text)
        return this.props.firebaseRef.parent().remove();
      this.props.dismissModal();
    },
    handleChange: function(e) {
      this.props.firebaseRef.update({
        text: e.target.value
      });
    },
    handleCancel: function(e) {
      e.preventDefault();
      if (!this.state.initialText)
        return this.props.firebaseRef.parent().remove();
      this.props.firebaseRef.update({
        text: this.state.initialText
      });
      this.props.dismissModal();
    },
    handleKeypress: function(e) {
      if (e.keyCode == 27)
        return this.handleCancel(e);
    },
    render: function() {
      return (
        <div className="text-modal">
          <form onSubmit={this.handleSubmit}>
            <button style={{order: 3}} type="submit">
              <i className="fa fa-check-circle"/>
            </button>
            <input style={{order: 2}} type="text" ref="text"
             value={this.props.text} onChange={this.handleChange}
             onKeyDown={this.handleKeypress}/>
            <button style={{order: 1}} onClick={this.handleCancel}>
              <i className="fa fa-times-circle"/>
            </button>
          </form>
        </div>
      );
    }
  });

  return TextModal;
});
