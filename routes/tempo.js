var path          = require('path')
  , config        = require('../config')
  , mongoose      = require('mongoose')
  , Tempo         = require('../model').Tempo
  , RoutesFactory = require('../lib/routesFactory')
  , utils         = require('../lib/utils');

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
exports.del = RoutesFactory.del(Tempo);

/*
 * GET list all tempo.
 */
exports.listAll = RoutesFactory.listAll(Tempo);

/*
 * GET list specific dates tempo.
 */
exports.listDates = RoutesFactory.listDates(Tempo);

/*
 * GET count by color between two dates.
 */
exports.count = RoutesFactory.count(Tempo, function(res, err, data) {
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