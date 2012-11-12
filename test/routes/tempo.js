var request  = require('supertest')
  , express  = require('express')
  , assert   = require('assert')
  , should   = require('should')
  , app      = require('../../app')
  , mongoose = require('mongoose')
  , Tempo    = require('../../model').Tempo;

/**
 * Utilities
 */
function getRandomColor() {
  var i = Math.floor(Math.random() * 3);
  switch (i) {
    case 0:
      return 'blue';
    case 1:
      return 'white';
    case 2:
      return 'red';
  }
}

/**
 * Tests
 */
describe('Tempo API', function() {

  describe('POST /tempo', function() {
    var postData = null;

    beforeEach(function() {
      postData = {
        year: 1985,
        month: 1,
        day: 18,
        color: 'blue'
      };
    });

    it('should respond 412 if no data provided', function(done) {
      request(app)
        .post('/tempo')
        .end(function(err, res){
          res.should.have.status(412);
          done();
        });
    });

    it('should respond 412 if invalid data provided', function(done) {
      postData.color = 'pink';

      request(app)
        .post('/tempo')
        .send(postData)
        .end(function(err, res){
          res.should.have.status(412);
          done();
        });
    });

    it('should save object to database and respond 200', function(done) {
      request(app)
        .post('/tempo')
        .send(postData)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          res.should.have.status(200);

          Tempo.findOneByDate(postData, function(err, tempo) {
            if (err) {
              return done(err);
            }

            tempo.should.be.ok;
            tempo.date.year.should.equal(postData.year);
            tempo.date.month.should.equal(postData.month);
            tempo.date.day.should.equal(postData.day);
            tempo.color.should.equal(postData.color);

            // remove test data.
            tempo.remove();

            done();
          });

        });
    });

    it('should have an alternative URL /tempo/{year}-{month}-{day} to save an object', function(done) {
      request(app)
        .post('/tempo/'+ postData.year +'-'+ postData.month + '-'+ postData.day)
        .send({color: postData.color})
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          res.should.have.status(200);

          Tempo.findOneByDate(postData, function(err, tempo) {
            if (err) {
              return done(err);
            }

            tempo.should.be.ok;
            tempo.date.year.should.equal(postData.year);
            tempo.date.month.should.equal(postData.month);
            tempo.date.day.should.equal(postData.day);
            tempo.color.should.equal(postData.color);

            // remove test data.
            tempo.remove();

            done();
          });

        });
    });
  });
  });

  describe('GET /tempo', function() {
    var tempoDayOutOf1985 = null;

    beforeEach(function(done) {
      var year = 1985;

      var date = new Date();
      date.setFullYear(year);
      date.setMonth(0);
      date.setDate(1);

      for (var i = 0; i < 365; i++) {
        var tempo = new Tempo();
        tempo.date.year  = date.getFullYear();
        tempo.date.month = date.getMonth() + 1;
        tempo.date.day   = date.getDate();
        tempo.color      = getRandomColor();
        tempo.save();

        date.setDate(date.getDate() + 1);
      }

      tempoDayOutOf1985 = new Tempo({
        date: {
          year: 1986,
          month: 3,
          day: 18
        },
        color: getRandomColor()
      });
      tempoDayOutOf1985.save();

      done();
    });

    afterEach(function(done) {
      Tempo.where('date.year').equals(1985).remove(function(err) {
        if (err) {
            return done(err);
        }

        tempoDayOutOf1985.remove();

        done();
      });
    });

    describe('GET /tempo', function() {
      it('should respond a JSON with all data', function(done) {
        request(app)
          .get('/tempo')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;


            res.body.length.should.equal(366);

            done();
          });
      });
    });

    describe('GET /tempo/{year}', function() {
      it('should respond a JSON with specific year data', function(done) {
        request(app)
          .get('/tempo/1985')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.ok.and.not.be.empty;

            for (var i in res.body) {
              var tempo = res.body[i];
              if (tempo && 'object' === typeof tempo) {
                tempo.date.year.should.equal(1985);
              }
            }

            done();
          });
      });
    });

    describe('GET /tempo/{year}-{month}', function() {
      it('should respond a JSON with specific month data', function(done) {
        request(app)
          .get('/tempo/1985-8')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.ok.and.not.be.empty;

            for (var i in res.body) {
              var tempo = res.body[i];
              if (tempo && 'object' === typeof tempo) {
                tempo.date.year.should.equal(1985);
                tempo.date.month.should.equal(8);
              }
            }

            done();
          });
      });
    });

    describe('GET /tempo/{year}-{month}-{day}', function() {
      it('should respond a JSON with specific day data', function(done) {
        request(app)
          .get('/tempo/1985-8-8')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.ok.and.not.be.empty;

            for (var i in res.body) {
              var tempo = res.body[i];
              if (tempo && 'object' === typeof tempo) {
                tempo.date.year.should.equal(1985);
                tempo.date.month.should.equal(8);
                tempo.date.day.should.equal(8);
              }
            }

            done();
          });
      });
    });

  });

});