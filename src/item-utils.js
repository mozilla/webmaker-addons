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
    }
  };
});
