define(function(require) {
  var _ = require('underscore');

  function itemOrder(item) {
    return item.order || 0;
  }

  return {
    getMaxOrder: function(items) {
      var frontItem = _.max(_.values(items), itemOrder);
      return frontItem.order || 0;
    },
    getMinOrder: function(items) {
      var backItem = _.min(_.values(items), itemOrder);
      return backItem.order || 0;
    },
    getOrderedKeys: function(items) {
      var keys = Object.keys(items);
      keys.sort(function(a, b) {
        a = items[a].order || 0;
        b = items[b].order || 0;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      return keys;
    },
    getFontList: function(items) {
      return _.unique(_.values(items).filter(function(item) {
        return item.props && item.props.fontFamily;
      }).map(function(item) {
        return item.props.fontFamily;
      }));
    }
  };
});
