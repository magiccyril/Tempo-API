
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Ejp      = mongoose.model('Ejp')
  , Factory  = require('./_factory')
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
    return res.status(500).jsonp({ error : new Error('Missing value')});
  }

  var date = utils.yearMonthDayToString(year, month, day);

  Ejp.findOneByDate(date, function(err, ejp) {
    if (err) {
      return res.send(501, { error: err });
    }

    // If object doesn't exist create it, else update it.
    if (!ejp) {
      ejp = new Ejp({
        'date.year': year,
        'date.month': month,
        'date.day': day
      });
    }

    ejp.zones = zones;

    ejp.save(function(err) {
      if (err) {
        return res.status(500).jsonp({ error: err });
      }

      res.send(200);
    });
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
    return res.status(500).jsonp({ error: err });
  }

  Ejp.count(data, function(err, zones) {
    if (err) {
      return res.status(500).jsonp({ error: err });
    }

    res.jsonp(zones);
  });
});