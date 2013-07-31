
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Ejp      = mongoose.model('Ejp')
  , Factory  = require('./factory')
  , utils    = require('../../lib/utils');

/**
 * Ejp creation.
 */
exports.create = function(req, res) {
  var year  = req.params.year  ? req.params.year  : req.body.year;
  var month = req.params.month ? req.params.month : req.body.month;
  var day   = req.params.day   ? req.params.day   : req.body.day;
  var zones = req.params.zones ? req.params.zones : req.body.zones;

  var zonesValid = 'object' === typeof zones
    && 'boolean' === typeof zones.north
    && 'boolean' === typeof zones.paca
    && 'boolean' === typeof zones.west
    && 'boolean' === typeof zones.south;

  if (!year || !month || !day || !zonesValid) {
    return res.send(501);
  }

  var ejp = new Ejp({
    'date.year': year,
    'date.month': month,
    'date.day': day,
    'zones': zones
  });

  ejp.save(function(err) {
    if (err) {
      return res.send(501, { error: err });
    }

    res.send(200);
  });
};

/**
 * Delte ejp.
 */
exports.del = Factory.del(Ejp);

/**
 * List all ejp.
 */
exports.listAll = Factory.listAll(Ejp);

/**
 * List specific dates ejp.
 */
exports.listDates = Factory.listDates(Ejp);

/**
 * Count by ejp values between two dates.
 */
exports.count = Factory.count(Ejp, function(res, err, data) {
  if (err) {
    return res.send(501, { error: err });
  }

  Ejp.count(data, function(err, zones) {
    if (err) {
      return res.send(501, { error: err });
    }

    res.json(zones);
  });
});