const splunkjs = require("splunk-sdk");

/**
 * SAMPLE FILE FOUND ON https://github.com/splunk/splunk-sdk-javascript/blob/master/examples/node/helloworld/log.js
 */
var Logger = splunkjs.Class.extend({
  init: function(service, opts) {
    this.service = service;

    opts = opts || {};

    this.params = {};
    if (opts.index) {
      this.params.index = opts.index;
    }
    if (opts.host) {
      this.params.host = opts.host;
    }
    if (opts.source) {
      this.params.source = opts.source;
    }
    if (opts.sourcetype) {
      this.params.sourcetype = opts.sourcetype || "demo-logger";
    }

    if (!this.service) {
      throw new Error("Must supply a valid service");
    }
  },

  log: function(data) {
    var message = {
      __time: new Date().toUTCString(),
      level: "LOG",
      data: data
    };

    this.service.log(message, this.params);
    console.log(data);
  },

  error: function(data) {
    var message = {
      __time: new Date().toUTCString(),
      level: "ERROR",
      data: data
    };

    this.service.log(message, this.params);
    console.error(data);
  },

  info: function(data) {
    var message = {
      __time: new Date().toUTCString(),
      level: "INFO",
      data: data
    };

    this.service.log(message, this.params);
    console.info(data);
  },

  warn: function(data) {
    var message = {
      __time: new Date().toUTCString(),
      level: "WARN",
      data: data
    };

    this.service.log(message, this.params);
    console.warn(data);
  }
});

exports.main = function(opts, done) {
  // This is just for testing - ignore it
  opts = opts || {};

  var username = opts.username || "admin";
  var password = opts.password || "splunk";
  var scheme = opts.scheme || "https";
  var host = opts.host || "splunkenterprise";
  var port = opts.port || "8089";
  var version = opts.version || "default";

  var service = new splunkjs.Service({
    username: username,
    password: password,
    scheme: scheme,
    host: host,
    port: port,
    version: version
  });

  // First, we log in
  service.login(function(err, success) {
    // We check for both errors in the connection as well
    // as if the login itself failed.
    if (err || !success) {
      console.log("Error in logging in");
      console.log(err || "Login failed");
      return;
    }

    // Create our logger
    var logger = new Logger(service, {
      sourcetype: "mylogger",
      source: "test"
    });

    logger.info(
      "[2019-03-18 22:48:32.991] User authenticated auth_type=api_key key_id=mk_123 user_id=usr_123"
    );
    logger.log(
      "[2019-03-18 22:48:32.992] Rate limiting ran rate_allowed=true rate_quota=100 rate_remaining=99"
    );
    logger.info(
      "[2019-03-18 22:48:32.998] Charge created charge_id=ch_123 permissions_used=account_write team=acquiring"
    );
    logger.info(
      "[2019-03-18 22:48:32.999] Request finished alloc_count=9123 database_queries=34 duration=0.009 http_status=200"
    );

    done();
  });
};
