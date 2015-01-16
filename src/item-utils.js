define(function(require) {
  var _ = require('underscore');

  return {
    // If the given item is already at the front, return null.
    // Otherwise, return the minimum order required to bring it
    // to the front.
    getBringToFrontOrder: function(items, itemKey) {
      var max = 0;
      Object.keys(items).forEach(function(key) {
        if (key == itemKey) return;
        if (items[key].type != items[itemKey].type) return;
        if (items[key].order > max)
          max = items[key].order;
      });
      max++;
      if ((items[itemKey].order || 0) < max)
        return max;
      return null;
    },
    getOrderedKeys: function(items) {
      var keys = Object.keys(items);
      keys.sort(function(a, b) {
        if (items[a].type != items[b].type) {
          // Text is always above images.
          return items[a].type == 'text' ? 1 : -1;
        }
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
