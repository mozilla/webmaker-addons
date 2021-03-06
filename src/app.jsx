define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var SelectionFrame = require('jsx!./selection-frame');
  var Fonts = require('jsx!./fonts');
  var PNGExport = require('./png-export');
  var ExportModal = require('jsx!./export-modal');
  var SelectionModal = require('jsx!./selection-modal');
  var itemUtils = require('./item-utils');
  var ScaleSizer = require('jsx!./scale-sizer');
  var PrimaryToolbar = require('jsx!./primary-toolbar');
  var SelectionToolbar = require('jsx!./selection-toolbar');
  var Canvas = require('jsx!./canvas');
  var KeypressMixin = require('./keypress-mixin');
  var GlobalSelectionActions = require('jsx!./global-selection-actions');
  var extractImgSrc = require('./extract-img-src');

  var CANVAS_BG = '#333333';

  var App = React.createClass({
    mixins: [KeypressMixin],
    getInitialState: function() {
      return {
        selectedItem: null,
        selectionModalClass: null,
        showExportModal: window.DEBUG_AUTOSHOW_EXPORT_MODAL,
        disableWebmakerInExport: window.DISABLE_WEBMAKER,
        items: this.props.initialItems || {}
      };
    },
    componentDidUpdate: function(prevProps, prevState) {
      var queuedItemSelection = this.queuedItemSelection;

      if ((prevState.items !== this.state.items) && queuedItemSelection) {
        this.queuedItemSelection = null;
        this.handleItemSelect(queuedItemSelection);
      }
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
        this.refs.globalSelectionToolbar.refs.globalSelectionActions
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
    toggleExportModal: function(e) {
      var disableWebmaker = window.DISABLE_WEBMAKER;

      if (e && e.ctrlKey)
        disableWebmaker = !disableWebmaker;

      this.setState({
        showExportModal: !this.state.showExportModal,
        disableWebmakerInExport: disableWebmaker
      });
    },
    getExportHtml: function() {
      var a = document.createElement('a');
      a.setAttribute('href', 'src/scale-to-parent.js');
      var scaleToParentURL = a.href;

      return React.renderToStaticMarkup(
        <html>
          <head>
            <meta charSet="utf-8"/>
            {Fonts.createLinkElements(itemUtils.getFontList(this.state.items),
                                      'https:')}
          </head>
          <body>
            <Canvas
             data-scale-to-parent
             background={CANVAS_BG}
             items={this.state.items}
             canvasWidth={this.props.canvasWidth}
             canvasHeight={this.props.canvasHeight}/>
            <script src={scaleToParentURL} async></script>
          </body>
        </html>
      );
    },
    handleClick: function(e) {
      if (e.target.hasAttribute('data-clear-selection-on-click'))
        this.clearSelection();
    },
    handleItemSelect: function(options, e) {
      if (typeof(options) == 'string')
        options = {key: options};
      var key = options.key;

      if (this.state.selectedItem == key &&
          !('modalClass' in options))
        return;

      if (!(this.state.items && (key in this.state.items))) {
        // Well, this is awkward. It's possible that the key was just
        // added but our Firebase listener hasn't been notified yet,
        // so queue this call for the next update.
        this.queuedItemSelection = options;
        return;
      }

      var newOrder = itemUtils.getBringToFrontOrder(this.state.items, key);
      if (newOrder !== null)
        this.props.firebaseRef.child(key).update({
          order: newOrder
        });
      this.setState({
        selectedItem: key,
        selectionModalClass: options.modalClass || null
      });
      if (document.activeElement)
        document.activeElement.blur();

      // This is useful if we're in an iframe.
      window.focus();
    },
    handleShowModal: function(modalClass) {
      this.setState({
        selectionModalClass: modalClass
      });
    },
    handleDismissModal: function() {
      this.setState({
        selectionModalClass: null
      });
    },
    clearSelection: function() {
      this.setState({
        selectedItem: null,
        selectionModalClass: null
      });
    },
    getSelectedItem: function() {
      return this.refs.canvas.refs.selectedItem;
    },
    getClippingFrame: function() {
      return this.refs.canvas;
    },
    getPointerScale: function() {
      return this.refs.scaleSizer.getPointerScale();
    },
    handleDragOver: function(e) {
      // Tell the browser that we'll handle a drop, no
      // matter what it is.
      e.preventDefault();
    },
    handleDroppedPNG: function(file) {
      var reader = new FileReader();

      reader.onload = function() {
        var items = PNGExport.extractItemsFromPNG(reader.result);
        if (!items) return;
        this.props.firebaseRef.update(items);
      }.bind(this);
      reader.readAsArrayBuffer(file);
    },
    handleDrop: function(e) {
      // It seems like the default drop behavior of any
      // browser is to navigate away from this page, so
      // don't let that happen.
      e.stopPropagation();
      e.preventDefault();

      var dt = e.dataTransfer;
      var file = dt.files[0];

      if (file && file.type == 'image/png')
        return this.handleDroppedPNG(file);

      var url = dt.getData('application/x-moz-file-promise-url');

      if (!url)
        url = extractImgSrc(dt.getData('text/html'));

      if (url) {
        this.refs.primaryToolbar
          .refs['add-image-button'].addImage(url);
        return;
      }

      var text = dt.getData('text/plain');
      if (text) {
        this.refs.primaryToolbar
          .refs['add-text-button'].addText(text);
      }
    },
    render: function() {
      return (
        <div className="app-content"
         onClick={this.handleClick}
         onDragOver={this.handleDragOver}
         onDrop={this.handleDrop}
         data-clear-selection-on-click>
          <header>
            <nav style={{height: 64, background: 'black'}}>
              <PrimaryToolbar ref="primaryToolbar"
               canvasWidth={this.props.canvasWidth}
               canvasHeight={this.props.canvasHeight}
               selectItem={this.handleItemSelect}
               firebaseRef={this.props.firebaseRef}
               onExport={this.toggleExportModal}/>
            </nav>
          </header>
          <div style={{
            paddingTop: 32,
            paddingBottom: 32,
            position: 'relative'
          }} data-clear-selection-on-click>
            <div style={{backgroundColor: CANVAS_BG}}>
              <ScaleSizer ref="scaleSizer"
               width={this.props.canvasWidth}
               height={this.props.canvasHeight}
               data-clear-selection-on-click>
                <Canvas ref="canvas" isEditable
                 background={CANVAS_BG}
                 items={this.state.items}
                 selectedItem={this.state.selectedItem}
                 canvasWidth={this.props.canvasWidth}
                 canvasHeight={this.props.canvasHeight}
                 firebaseRef={this.props.firebaseRef}
                 onClearSelection={this.clearSelection}
                 onItemSelect={this.handleItemSelect}
                 getPointerScale={this.getPointerScale}/>
              </ScaleSizer>
            </div>
            {this.state.selectionModalClass
             ? <SelectionModal
                modalClass={this.state.selectionModalClass}
                dismissModal={this.handleDismissModal}
                selectedItem={this.state.selectedItem}
                items={this.state.items}
                firebaseRef={this.props.firebaseRef}/>
             : null}
          </div>
          <Fonts fonts={itemUtils.getFontList(this.state.items)}/>
          {this.state.selectedItem
           ? <div>
               <SelectionFrame
                getSelectedItem={this.getSelectedItem}
                getClippingFrame={this.getClippingFrame}/>
               <SelectionToolbar
                selectedItem={this.state.selectedItem}
                items={this.state.items}
                firebaseRef={this.props.firebaseRef}
                currentModal={this.state.selectionModalClass}
                showModal={this.handleShowModal}/>
               <SelectionToolbar ref="globalSelectionToolbar"
                className="global-selection-toolbar"
                actionClasses={[GlobalSelectionActions]}
                selectedItem={this.state.selectedItem}
                items={this.state.items}
                firebaseRef={this.props.firebaseRef}/>
             </div>
           : null}
          {this.state.showExportModal
           ? <ExportModal
              items={this.state.items}
              html={this.getExportHtml()}
              disableWebmaker={this.state.disableWebmakerInExport}
              onClose={this.toggleExportModal}/>
           : null}
        </div>
      );
    }
  });

  return App;
});
