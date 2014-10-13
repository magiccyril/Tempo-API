
/**
 * Module dependencies.
 */

var env     = process.env.NODE_ENV || 'development'
  , config  = require('../../config/config')[env]
  , sys     = require('sys')
  , exec    = require('child_process').exec;

/**
 * Run cron command defined in configuration.
 */
exports.cron = function(req, res) {
  exec(config.cron, function (error, stdout, stderr) {
    if (error) {
      return res.status(500).jsonp({ error: error });
    }

    if (stderr) {
      return res.status(500).jsonp({ stderr: stderr });
    }

    return res.jsonp(stdout);
  });
};
