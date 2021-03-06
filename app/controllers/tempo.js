
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Tempo    = mongoose.model('Tempo')
  , Factory  = require('./_factory')
  , utils    = require('../../lib/utils');

/**
 * Tempo creation.
 */
exports.create = function(req, res) {
  var year  = req.params.year  ? req.params.year  : req.body.year;
  var month = req.params.month ? req.params.month : req.body.month;
  var day   = req.params.day   ? req.params.day   : req.body.day;
  var color = req.params.color ? req.params.color : req.body.color;

  if (!year || !month || !day || !color) {
    return res.status(500).jsonp({ error : new Error('Missing value')});
  }

  var date = utils.yearMonthDayToString(year, month, day);

  Tempo.findOneByDate(date, function(err, tempo) {
    if (err) {
      return res.send(501, { error: err });
    }

    // If object doesn't exist create it, else update it.
    if (!tempo) {
      tempo = new Tempo({
        'date.year': year,
        'date.month': month,
        'date.day': day
      });
    }

    tempo.color = color;

    tempo.save(function(err) {
      if (err) {
        return res.status(500).jsonp({ error: err });
      }

      res.send(200);
    });
  });
};

/**
 * Delete tempo.
 */
exports.del = Factory.del(Tempo);

/**
 * List all tempo.
 */
exports.listAll = Factory.listAll(Tempo);

/**
 * List specific dates tempo.
 */
exports.listDates = Factory.listDates(Tempo);

/**
 * Count by color between two dates.
 */
exports.count = Factory.count(Tempo, function(res, err, data) {
  if (err) {
    return res.status(500).jsonp({ error: err });
  }

  Tempo.count(data, function(err, colors) {
    if (err) {
      return res.status(500).jsonp({ error: err });
    }

    res.jsonp(colors);
  });
});