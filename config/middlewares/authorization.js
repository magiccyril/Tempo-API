var env = process.env.NODE_ENV || 'development'
  , config = require('../config')[env];

/**
 *  API Key authorization middleware
 */

exports.hasApiKey = function (req, res, next) {
  if (req.query && req.query.apikey && req.query.apikey == config.apikey) {
    return next();
  }

  return res.status(401).json({error : 'Access denied'});
}
