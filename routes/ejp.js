var path     = require('path')
  , config   = require('../config')
  , mongoose = require('mongoose')
  , Ejp      = require('../model').Ejp
  , utils    = require('../lib/utils');

/*
 * POST ejp creation.
 */
exports.create = function(req, res) {
  var year      = req.params.year  ? req.params.year  : req.body.year;
  var month     = req.params.month ? req.params.month : req.body.month;
  var day       = req.params.day   ? req.params.day   : req.body.day;
  var ejpValues = req.params.ejp   ? req.params.ejp   : req.body.ejp;

  var ejpValuesValid = 'object' === typeof ejpValues
    && 'boolean' === typeof ejpValues.north
    && 'boolean' === typeof ejpValues.paca
    && 'boolean' === typeof ejpValues.west
    && 'boolean' === typeof ejpValues.south;

  if (!year || !month || !day || !ejpValuesValid) {
    return res.send(501);
  }

  var ejp = new Ejp({
    'date.year': year,
    'date.month': month,
    'date.day': day,
    'ejp': ejpValues
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
exports.del = function(req, res) {
  var year  = req.params.year;
  var month = req.params.month;
  var day   = req.params.day;

  if (!year || !month || !day) {
    return res.send(501);
  }

  var date = utils.yearMonthDayToString(year, month, day);

  Ejp.findOneByDate(date, function(err, ejp) {
    if (err) {
      return res.send(501, { error: err });
    }

    if (!ejp) {
      return res.send(501);
    }

    ejp.remove(function(err) {
      if (err) {
        return res.send(501, { error: err });
      }

      return res.send(200);
    });

  });

};

/*
 * GET list all ejp.
 */
exports.listAll = function(req, res) {
  Ejp.find({}, function(err, data) {
    if (err) {
      return res.send(501, { error: err });
    }

    res.json(data);
  });
};

/*
 * GET list specific dates ejp.
 */
exports.listDates = function(req, res) {
  var date = utils.yearMonthDayToString(req.params.year, req.params.month, req.params.day);

  Ejp.findByDate(date, function(err, data) {
    if (err) {
      return res.send(501, { error: err });
    }

    res.json(data);
  });
};

/*
 * GET count by ejp values between two dates.
 */
exports.count = function(req, res) {
  var from = req.query.from ? req.query.from : utils.yearMonthDayToString(req.params.year, req.params.month, req.params.day);
  var to   = req.query.to;

  if (!from) {
    return res.send(501, { error: 'Invalid arguments' });
  }

  if (!to) {
    to = new Date();
  }

  Ejp.findByDateRange(from, to, function(err, data) {
    if (err) {
      return res.send(501, { error: err });
    }

    var counters = {
      'north': 0,
      'paca': 0,
      'west': 0,
      'south': 0
    };

    for (var i in data) {
      var ejp = data[i];

      if (ejp.ejp) {
        counters[ejp.ejp]++;
      }
    }

    res.json(counters);
  });
}