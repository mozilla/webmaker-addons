var md5 = require('./md5');
var env = require('./env');

exports["test md5"] = function(assert) {
  assert.equal(md5("hi"), "49f68a5c8493ec2c0bf489821c21fc3b");
};

exports["test env"] = function(assert) {
  assert.ok(env.get("PATH"),
            "existing env vars can be retrieved");
  assert.ok(!env.get("NONEXISTENT_ENV_VAR"),
            "nonexistent env vars are falsy");
};

require("sdk/test").run(exports);
