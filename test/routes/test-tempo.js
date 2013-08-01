
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should   = require('should')
  , request  = require('supertest')
  , app      = require('../../app')
  , async    = require('async')
  , Tempo    = mongoose.model('Tempo')
  , utils    = require('../../lib/utils')
  , agent    = request.agent(app);

/**
 * Tempo functional tests
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

    it('should respond 501 if no data provided', function(done) {
      agent
      .post('/tempo')
      .expect(501)
      .end(done);
    });

    it('should respond 501 if invalid data provided', function(done) {
      postData.color = 'pink';

      agent
      .post('/tempo')
      .send(postData)
      .expect(501)
      .end(done);
    });

    it('should save object to database and respond 200', function(done) {
      agent
      .post('/tempo')
      .send(postData)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

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
      agent
      .post('/tempo/'+ postData.year +'-'+ postData.month + '-'+ postData.day)
      .send({color: postData.color})
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

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

  describe('DELETE /tempo/{year}-{month}-{day}', function() {
    var testData = null;
    var testTempo = null;

    beforeEach(function(done) {
      testData = {
        date: {
          year: 1985,
          month: 1,
          day: 18
        },
        color: 'blue'
      };
      testTempo = new Tempo(testData);
      testTempo.save(function(err) {
        if (err) {
          return done(err);
        }

        done();
      });
    });

    afterEach(function(done) {
      testTempo.remove(function(err) {
        if (err) {
          return done(err);
        }

        done();
      });
    });

    it('should delete an object', function(done) {
      agent
      .del('/tempo/'+ testData.date.year +'-'+ testData.date.month + '-'+ testData.date.day)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }


        Tempo.findOneByDate(testData.date, function(err, tempo) {
          if (err) {
            return done(err);
          }

          should.not.exist(tempo);

          done();
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
        tempo.color      = utils.getRandomColor();
        tempo.save();

        date.setDate(date.getDate() + 1);
      }

      tempoDayOutOf1985 = new Tempo({
        date: {
          year: 1986,
          month: 3,
          day: 18
        },
        color: utils.getRandomColor()
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
        agent
        .get('/tempo')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          res.should.be.json;
          res.body.length.should.equal(366);

          done();
        });
      });
    });

    describe('GET /tempo/{year}', function() {
      it('should respond a JSON with specific year data', function(done) {
        agent
        .get('/tempo/1985')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
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
        agent
        .get('/tempo/1985-8')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
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
        agent
        .get('/tempo/1985-8-8')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
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

  describe('GET /tempo/count', function() {
    var year = 1985;

    beforeEach(function(done) {
      var date = new Date();
      date.setDate(1);
      date.setMonth(9 - 1);
      date.setFullYear(year);

      for (var i = 0; i < 365; i++) {
        var tempo = new Tempo();
        tempo.date.year  = date.getFullYear();
        tempo.date.month = date.getMonth() + 1;
        tempo.date.day   = date.getDate();
        tempo.color      = utils.getRandomColor();
        tempo.save();

        date.setDate(date.getDate() + 1);
      }

      done();
    });

    afterEach(function(done) {
      var deleteYear = function (year) {
        return function (callback) {
          Tempo.where('date.year', year).remove(function(err) {
            if (err) {
              callback(err);
            }

            callback(null);
          });
        }
      }

      async.parallel([deleteYear(year), deleteYear(year + 1)], function(err) {
        if (err) {
          return done(err);
        };

        done();
      });
    });

    it('should respond a JSON with the count of colors between two dates', function(done) {
      agent
      .get('/tempo/count?from=1985-09-01&to=1986-01-18')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        res.should.be.json;

        should.exist(res.body.blue);
        should.exist(res.body.white);
        should.exist(res.body.red);

        var sum = res.body.blue + res.body.white + res.body.red;
        // 141 = from year - 1 september 1 to january 18
        sum.should.be.equal(141);

        done();
      });
    });

    it('should respond a JSON with the count of ejp days between one date and now', function(done) {
      var now        = new Date();
      var dateString = now.getFullYear() + '-1-1';

      agent
      .get('/tempo/count/' + dateString)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        res.should.be.json;

        should.exist(res.body.blue);
        should.exist(res.body.white);
        should.exist(res.body.red);

        done();
      });
    });

  });

});