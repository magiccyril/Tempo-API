var path = require("path"),
    config = require('../config'),
    mongoose = require('mongoose'),
    Tempo = require('../model/tempo');

/*
 * POST tempo creation.
 */

exports.create = function(req, res) {
    var day = req.body.day;
    var color = req.body.color;

    if (!day || !color) {
        res.send(412);
    }

    res.send(200);
};