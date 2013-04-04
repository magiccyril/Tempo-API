var path     = require('path')
  , config   = require('../config')
  , mongoose = require('mongoose')
  , utils    = require('../lib/utils');

/**
 * DELETE
 */
exports.del = function(Model) {
  return function(req, res) {
    var year  = req.params.year;
    var month = req.params.month;
    var day   = req.params.day;

    if (!year || !month || !day) {
      return res.send(501);
    }

    var date = utils.yearMonthDayToString(year, month, day);

    Model.findOneByDate(date, function(err, data) {
      if (err) {
        return res.send(501, { error: err });
      }

      if (!data) {
        return res.send(501);
      }

      data.remove(function(err) {
        if (err) {
          return res.send(501, { error: err });
        }

        return res.send(200);
      });

    });
  };
}

/*
 * GET list all objects.
 */
exports.listAll = function(Model) {
  return function(req, res) {
    Model.find({}, function(err, data) {
      if (err) {
        return res.send(501, { error: err });
      }

      res.json(data);
    });
  }
};

/*
 * GET list specific dates objects.
 */
exports.listDates = function(Model) {
  return function(req, res) {
    var date = utils.yearMonthDayToString(req.params.year, req.params.month, req.params.day);

    Model.findByDate(date, function(err, data) {
      if (err) {
        return res.send(501, { error: err });
      }

      res.json(data);
    });
  }
};

/*
 * GET count by objects values between two dates.
 */
exports.count = function(Model, callback) {
  return function(req, res) {
    var from = req.query.from ? req.query.from : utils.yearMonthDayToString(req.params.year, req.params.month, req.params.day);
    var to   = req.query.to;

    if (!from) {
      return res.send(501, { error: 'Invalid arguments' });
    }

    if (!to) {
      to = new Date();
    }

    Model.findByDateRange(from, to, function(err, data) {
      callback(res, err, data);
    });
  }
};