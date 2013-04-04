var path          = require('path')
  , config        = require('../config')
  , mongoose      = require('mongoose')
  , Ejp           = require('../model').Ejp
  , RoutesFactory = require('../lib/routesFactory')
  , utils         = require('../lib/utils');

/*
 * POST ejp creation.
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

/*
 * DELETE ejp.
 */
exports.del = RoutesFactory.del(Ejp);

/*
 * GET list all ejp.
 */
exports.listAll = RoutesFactory.listAll(Ejp);

/*
 * GET list specific dates ejp.
 */
exports.listDates = RoutesFactory.listDates(Ejp);

/*
 * GET count by ejp values between two dates.
 */
exports.count = RoutesFactory.count(Ejp, function(res, err, data) {
  if (err) {
    return res.send(501, { error: err });
  }

  var zones = {
    'north': 0,
    'paca': 0,
    'west': 0,
    'south': 0
  };

  for (var i in data) {
    var ejp = data[i];

    if (ejp.zones) {
      zones[ejp.zones]++;
    }
  }

  res.json(zones);
});