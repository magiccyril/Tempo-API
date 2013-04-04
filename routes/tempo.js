var path     = require('path')
  , config   = require('../config')
  , mongoose = require('mongoose')
  , Tempo    = require('../model').Tempo
  , utils    = require('../lib/utils');

/*
 * POST tempo creation.
 */
exports.create = function(req, res) {
  var year  = req.params.year  ? req.params.year  : req.body.year;
  var month = req.params.month ? req.params.month : req.body.month;
  var day   = req.params.day   ? req.params.day   : req.body.day;
  var color = req.params.color ? req.params.color : req.body.color;

  if (!year || !month || !day || !color) {
    return res.send(501);
  }

  var tempo = new Tempo({
    'date.year': year,
    'date.month': month,
    'date.day': day,
    'color': color
  });

  tempo.save(function(err) {
    if (err) {
      return res.send(501, { error: err });
    }

    res.send(200);
  });
};

/*
 * DELETE tempo.
 */
exports.del = function(req, res) {
  var year  = req.params.year;
  var month = req.params.month;
  var day   = req.params.day;

  if (!year || !month || !day) {
    return res.send(501);
  }

  var date = utils.yearMonthDayToString(year, month, day);

  Tempo.findOneByDate(date, function(err, tempo) {
    if (err) {
      return res.send(501, { error: err });
    }

    if (!tempo) {
      return res.send(501);
    }

    tempo.remove(function(err) {
      if (err) {
        return res.send(501, { error: err });
      }

      return res.send(200);
    });

  });

};

/*
 * GET list all tempo.
 */
exports.listAll = function(req, res) {
  Tempo.find({}, function(err, data) {
    if (err) {
      return res.send(501, { error: err });
    }

    res.json(data);
  });
};

/*
 * GET list specific dates tempo.
 */
exports.listDates = function(req, res) {
  var date = utils.yearMonthDayToString(req.params.year, req.params.month, req.params.day);

  Tempo.findByDate(date, function(err, data) {
    if (err) {
      return res.send(501, { error: err });
    }

    res.json(data);
  });
};

/*
 * GET count by color between two dates.
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

  Tempo.findByDateRange(from, to, function(err, data) {
    if (err) {
      return res.send(501, { error: err });
    }

    var colors = {
      'blue': 0,
      'white': 0,
      'red': 0
    };

    for (var i in data) {
      var tempo = data[i];

      if (tempo.color) {
        colors[tempo.color]++;
      }
    }

    res.json(colors);
  });
}