var request  = require('supertest')
  , express  = require('express')
  , assert   = require('assert')
  , app      = require('../app')
  , fixtures = require('./fixtures')
  , mongoose = require('mongoose')
  , Tempo    = require('../model/tempo');

describe('POST /tempo', function() {
    it('respond 412 if no object provided', function(done) {
        request(app)
            .post('/tempo')
            .expect(412, done);
    });

    it('save object to database and respond 200', function(done) {
        var object = fixtures.tempo;

        request(app)
            .post('/tempo')
            .send({ day: object.day, color: object.color })
            .expect(200)
            .end(function(err, res){
                if (err) {
                    return done(err);
                }

                Tempo.findOne({ day: object.day }, function (err, tempo) {
                    if (err) {
                        return done(err);
                    }

                    if (!tempo) {
                        throw new Error("Object not found in database");
                    }

                    done();
                });
            });
    });
});
