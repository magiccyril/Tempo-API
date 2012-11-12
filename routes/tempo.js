var path = require('path')
  , config = require('../config')
  , mongoose = require('mongoose')
  , Tempo = require('../model').Tempo;

/*
 * POST tempo creation.
 */

exports.create = function(req, res) {
    var year  = req.body.year;
    var month = req.body.month;
    var day   = req.body.day;
    var color = req.body.color;

    if (!year || !month || !day || !color) {
        return res.send(412);
    }

    var tempo = new Tempo({
        'date.year': year,
        'date.month': month,
        'date.day': day,
        'color': color
    });

    tempo.save(function(err) {
        if (err) {
            return res.send(412, { error: err });
        }

        res.send(200);
    });
};

/*
 * GET list all tempo.
 */

exports.listAll = function(req, res) {
    Tempo.find({}, function(err, data) {
        if (err) {
            return res.send(412, { error: err });
        }

        res.json(data);
    });
};

/*
 * GET list specific dates tempo.
 */

function getListDate(year, month, day) {
    var date = '';
    if (year) {
        date += year;
    }
    if (month) {
        date += '-' + month;
    }
    if (day) {
        date += '-' + day;
    }

    return date;
}

exports.listDates = function(req, res) {
    var year  = req.params.year;
    var month = req.params.month;
    var day   = req.params.day;

    var date  = getListDate(year, month, day);

    Tempo.findByDate(date, function(err, data) {
        if (err) {
            return res.send(412, { error: err });
        }

        res.json(data);
    });
};