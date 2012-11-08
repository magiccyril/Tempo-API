var request  = require('supertest')
  , express  = require('express')
  , assert   = require('assert')
  , should   = require('should')
  , app      = require('../../app')
  , mongoose = require('mongoose')
  , Tempo    = require('../../model').Tempo;

describe('Tempo API', function() {

  describe('POST /tempo', function() {
    it('should respond 412 if no object provided', function(done) {
      request(app)
        .post('/tempo')
        .end(function(err, res){
          res.should.have.status(412);
          done();
        });
    });

    it('should save object to database and respond 200', function(done) {
      var tempo = new Tempo();

      request(app)
        .post('/tempo')
        .send({ day: tempo.day, color: tempo.color })
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          res.should.have.status(200);

          Tempo.findOne({ day: object.day }, function (err, data) {
            if (err) {
              return done(err);
            }

            should.exist(data);

            done();
          });
        });
    });
  });
});
