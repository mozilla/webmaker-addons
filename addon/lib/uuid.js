var uuid = require('sdk/util/uuid').uuid;

module.exports = function() {
  return uuid().toString().slice(1, -1);
};
