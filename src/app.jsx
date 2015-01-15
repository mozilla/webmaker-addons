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

  var App = React.createClass({
    getInitialState: function() {
      return {
        selectedItem: null,
        selectedItemDOMNode: null,
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
        selectedItem: key,
        selectedItemDOMNode: e.target
      });
    },
    clearSelection: function() {
      this.setState({
        selectedItem: null,
        selectedItemDOMNode: null
      });
    },
    getPointerScale: function() {
      return this.refs.scaleSizer.getPointerScale();
    },
    createExportModal: function() {
      if (!this.state.showExportModal) return null;
      return <ExportModal html={this.getExportHtml()} onClose={this.toggleExportModal}/>;
    },
    render: function() {
      return (
        <div>
          <PrimaryToolbar ref="primaryToolbar" canvasWidth={this.props.canvasWidth} canvasHeight={this.props.canvasHeight} firebaseRef={this.props.firebaseRef} onExport={this.toggleExportModal}/>
          <ScaleSizer ref="scaleSizer" width={this.props.canvasWidth} height={this.props.canvasHeight}>
            <Canvas isEditable items={this.state.items} selectedItem={this.state.selectedItem} canvasWidth={this.props.canvasWidth} canvasHeight={this.props.canvasHeight} firebaseRef={this.props.firebaseRef} onClearSelection={this.clearSelection} onItemSelect={this.handleItemSelect} getPointerScale={this.getPointerScale}/>
          </ScaleSizer>
          <SelectionFrame selection={this.state.selectedItemDOMNode}/>
          <Fonts fonts={itemUtils.getFontList(this.state.items)}/>
          <SelectionToolbar selectedItem={this.state.selectedItem} items={this.state.items} firebaseRef={this.props.firebaseRef}/>
          {this.createExportModal()}
        </div>
      );
    }
  });

  return App;
});
