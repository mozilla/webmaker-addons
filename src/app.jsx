define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var SelectionFrame = require('jsx!./selection-frame');
  var Fonts = require('jsx!./fonts');
  var ExportModal = require('jsx!./export-modal');
  var itemUtils = require('./item-utils');
  var ScaleSizer = require('jsx!./scale-sizer');
  var PrimaryToolbar = require('jsx!./primary-toolbar');
  var SelectionToolbar = require('jsx!./selection-toolbar');
  var Canvas = require('jsx!./canvas');
  var KeypressMixin = require('./keypress-mixin');

  var App = React.createClass({
    mixins: [KeypressMixin],
    getInitialState: function() {
      return {
        selectedItem: null,
        showExportModal: false,
        items: null
      };
    },
    componentWillMount: function() {
      this.props.firebaseRef.on("value", this.handleFirebaseRefValue);
    },
    componentWillUnmount: function() {
      this.props.firebaseRef.off("value", this.handleFirebaseRefValue);
    },
    handleKeypress: function(code) {
      if (!this.state.selectedItem) return;

      var selectedItem = this.getSelectedItem();

      if (code == this.KEY_BACKSPACE) {
        this.refs.selectionToolbar.refs.baseSelectionActions
          .handleRemove();
      } else if (code == this.KEY_ARROW_UP) {
        selectedItem.nudgeUp();
      } else if (code == this.KEY_ARROW_DOWN) {
        selectedItem.nudgeDown();
      } else if (code == this.KEY_ARROW_LEFT) {
        selectedItem.nudgeLeft();
      } else if (code == this.KEY_ARROW_RIGHT) {
        selectedItem.nudgeRight();
      }
    },
    handleFirebaseRefValue: function(snapshot) {
      var items = snapshot.val() || {};
      var selectedItem = this.state.selectedItem;

      if (selectedItem && !(selectedItem in items))
        this.clearSelection();

      this.setState({items: items});
    },
    toggleExportModal: function() {
      this.setState({showExportModal: !this.state.showExportModal});
    },
    getExportHtml: function() {
      return React.renderToStaticMarkup(
        <html>
          <head>
            <meta charSet="utf-8"/>
            {Fonts.createLinkElements(itemUtils.getFontList(this.state.items),
                                      'https:')}
          </head>
          <body>
            <Canvas items={this.state.items} canvasWidth={this.props.canvasWidth} canvasHeight={this.props.canvasHeight}/>
          </body>
        </html>
      );
    },
    handleItemSelect: function(key, e) {
      this.setState({
        selectedItem: key
      });
      if (document.activeElement)
        document.activeElement.blur();
    },
    clearSelection: function() {
      this.setState({
        selectedItem: null
      });
    },
    getSelectedItem: function() {
      return this.refs.canvas.refs.selectedItem;
    },
    getPointerScale: function() {
      return this.refs.scaleSizer.getPointerScale();
    },
    render: function() {
      return (
        <div>
          <PrimaryToolbar ref="primaryToolbar"
           canvasWidth={this.props.canvasWidth}
           canvasHeight={this.props.canvasHeight}
           firebaseRef={this.props.firebaseRef}
           onExport={this.toggleExportModal}/>
          <ScaleSizer ref="scaleSizer"
           width={this.props.canvasWidth}
           height={this.props.canvasHeight}>
            <Canvas ref="canvas" isEditable
             items={this.state.items}
             selectedItem={this.state.selectedItem}
             canvasWidth={this.props.canvasWidth}
             canvasHeight={this.props.canvasHeight}
             firebaseRef={this.props.firebaseRef}
             onClearSelection={this.clearSelection}
             onItemSelect={this.handleItemSelect}
             getPointerScale={this.getPointerScale}/>
          </ScaleSizer>
          <Fonts fonts={itemUtils.getFontList(this.state.items)}/>
          {this.state.selectedItem
           ? <div>
               <SelectionFrame getSelectedItem={this.getSelectedItem}/>
               <SelectionToolbar ref="selectionToolbar"
                selectedItem={this.state.selectedItem}
                items={this.state.items}
                firebaseRef={this.props.firebaseRef}/>
             </div>
           : null}
          {this.state.showExportModal
           ? <ExportModal
              html={this.getExportHtml()}
              onClose={this.toggleExportModal}/>
           : null}
        </div>
      );
    }
  });

  return App;
});
