
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should   = require('should')
  , request  = require('supertest')
  , app      = require('../../app')
  , async    = require('async')
  , Ejp      = mongoose.model('Ejp')
  , utils    = require('../../lib/utils')
  , agent    = request.agent(app);

/**
 * Ejp functional tests
 */

describe('EJP API', function() {

  describe('POST /ejp', function() {
    var postData = null;

    beforeEach(function() {
      postData = {
        year: 1985,
        month: 1,
        day: 18,
        zones: {
          north: utils.getRandomBoolean(),
          paca: utils.getRandomBoolean(),
          west: utils.getRandomBoolean(),
          south: utils.getRandomBoolean()
        }
      };
    });

    it('should respond 500 if no data provided', function(done) {
      agent
      .post('/ejp')
      .expect(500)
      .expect('Content-Type', /json/)
      .end(done);
    });

    it('should respond 500 if invalid data provided', function(done) {
      postData.zones = {
        north: 'ejp',
        paca: 'oui'
      };

      agent
      .post('/ejp')
      .send(postData)
      .expect(500)
      .expect('Content-Type', /json/)
      .end(done);
    });

    it('should save object to database and respond 200', function(done) {
      agent
      .post('/ejp')
      .send(postData)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        Ejp.findOneByDate(postData, function(err, ejp) {
          if (err) {
            return done(err);
          }

          ejp.should.be.ok;
          ejp.date.year.should.equal(postData.year);
          ejp.date.month.should.equal(postData.month);
          ejp.date.day.should.equal(postData.day);
          ejp.zones.north.should.equal(postData.zones.north);
          ejp.zones.paca.should.equal(postData.zones.paca);
          ejp.zones.west.should.equal(postData.zones.west);
          ejp.zones.south.should.equal(postData.zones.south);

          // remove test data.
          ejp.remove();

          done();
        });

      });
    });

    it('should have an alternative URL /ejp/{year}-{month}-{day} to save an object', function(done) {
      agent
      .post('/ejp/'+ postData.year +'-'+ postData.month + '-'+ postData.day)
      .send({zones: postData.zones})
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        Ejp.findOneByDate(postData, function(err, ejp) {
          if (err) {
            return done(err);
          }

          ejp.should.be.ok;
          ejp.date.year.should.equal(postData.year);
          ejp.date.month.should.equal(postData.month);
          ejp.date.day.should.equal(postData.day);
          ejp.zones.north.should.equal(postData.zones.north);
          ejp.zones.paca.should.equal(postData.zones.paca);
          ejp.zones.west.should.equal(postData.zones.west);
          ejp.zones.south.should.equal(postData.zones.south);

          // remove test data.
          ejp.remove();

          done();
        });

      });
    });
  });

  describe('DELETE /ejp/{year}-{month}-{day}', function() {
    var testData = null;
    var testEjp = null;

    beforeEach(function(done) {
      testData = {
        date: {
          year: 1985,
          month: 1,
          day: 18
        },
        zones: {
          north: utils.getRandomBoolean(),
          paca: utils.getRandomBoolean(),
          west: utils.getRandomBoolean(),
          south: utils.getRandomBoolean()
        }
      };
      testEjp = new Ejp(testData);
      testEjp.save(function(err) {
        if (err) {
          return done(err);
        }

        done();
      });
    });

    afterEach(function(done) {
      testEjp.remove(function(err) {
        if (err) {
          return done(err);
        }

        done();
      });
    });

    it('should delete an object', function(done) {
      agent
      .del('/ejp/'+ testData.date.year +'-'+ testData.date.month + '-'+ testData.date.day)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        Ejp.findOneByDate(testData.date, function(err, ejp) {
          if (err) {
            return done(err);
          }

          should.not.exist(ejp);

          done();
        });
      });
    });
  });

  describe('GET /ejp', function() {
    var ejpDayOutOf1985 = null;

    beforeEach(function(done) {
      var year = 1985;

      var date = new Date();
      date.setFullYear(year);
      date.setMonth(0);
      date.setDate(1);

      for (var i = 0; i < 365; i++) {
        var ejp = new Ejp();
        ejp.date.year  = date.getFullYear();
        ejp.date.month = date.getMonth() + 1;
        ejp.date.day   = date.getDate();
        ejp.zones      = {
          north: utils.getRandomBoolean(),
          paca: utils.getRandomBoolean(),
          west: utils.getRandomBoolean(),
          south: utils.getRandomBoolean()
        };
        ejp.save();

        date.setDate(date.getDate() + 1);
      }

      ejpDayOutOf1985 = new Ejp({
        date: {
          year: 1986,
          month: 3,
          day: 18
        },
        zones: {
          north: utils.getRandomBoolean(),
          paca: utils.getRandomBoolean(),
          west: utils.getRandomBoolean(),
          south: utils.getRandomBoolean()
        }
      });
      ejpDayOutOf1985.save();

      done();
    });

    afterEach(function(done) {
      Ejp.where('date.year').equals(1985).remove(function(err) {
        if (err) {
            return done(err);
        }

        ejpDayOutOf1985.remove();

        done();
      });
    });

    describe('GET /ejp', function() {
      it('should respond a JSON with all data', function(done) {
        agent
        .get('/ejp')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          res.should.be.json;

          res.body.length.should.equal(366);

          done();
        });
      });
    });

    describe('GET /ejp/{year}', function() {
      it('should respond a JSON with specific year data', function(done) {
        agent
        .get('/ejp/1985')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          res.should.be.json;
          res.body.should.be.ok.and.not.be.empty;

          for (var i in res.body) {
            var ejp = res.body[i];
            if (ejp && 'object' === typeof ejp) {
              ejp.date.year.should.equal(1985);
            }
          }

          done();
        });
      });
    });

    describe('GET /ejp/{year}-{month}', function() {
      it('should respond a JSON with specific month data', function(done) {
        agent
        .get('/ejp/1985-8')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          res.should.be.json;
          res.body.should.be.ok.and.not.be.empty;

          for (var i in res.body) {
            var ejp = res.body[i];
            if (ejp && 'object' === typeof ejp) {
              ejp.date.year.should.equal(1985);
              ejp.date.month.should.equal(8);
            }
          }

          done();
        });
      });
    });

    describe('GET /ejp/{year}-{month}-{day}', function() {
      it('should respond a JSON with specific day data', function(done) {
        agent
        .get('/ejp/1985-8-8')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          res.should.be.json;
          res.body.should.be.ok.and.not.be.empty;

          for (var i in res.body) {
            var ejp = res.body[i];
            if (ejp && 'object' === typeof ejp) {
              ejp.date.year.should.equal(1985);
              ejp.date.month.should.equal(8);
              ejp.date.day.should.equal(8);
            }
          }

          done();
        });
      });
    });

  });

  describe('GET /ejp/count', function() {
    var year = 1985;

    beforeEach(function(done) {
      var date = new Date();
      date.setDate(1);
      date.setMonth(9 - 1);
      date.setFullYear(year);

      for (var i = 0; i < 365; i++) {
        var ejp = new Ejp();
        ejp.date.year  = date.getFullYear();
        ejp.date.month = date.getMonth() + 1;
        ejp.date.day   = date.getDate();
        ejp.zones      = {
          north: utils.getRandomBoolean(),
          paca: utils.getRandomBoolean(),
          west: utils.getRandomBoolean(),
          south: utils.getRandomBoolean()
        };
        ejp.save();

        date.setDate(date.getDate() + 1);
      }

      done();
    });

    afterEach(function(done) {
      var deleteYear = function (year) {
        return function (callback) {
          Ejp.where('date.year', year).remove(function(err) {
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

    it('should respond a JSON with the count of ejp days between two dates', function(done) {
      agent
      .get('/ejp/count?from=1985-09-01&to=1986-01-18')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        res.should.be.json;

        should.exist(res.body.north);
        should.exist(res.body.paca);
        should.exist(res.body.west);
        should.exist(res.body.south);

        done();
      });
    });

    it('should respond a JSON with the count of ejp days between one date and now', function(done) {
      var now       = new Date();
      var dateString = now.getFullYear() + '-1-1';

      agent
      .get('/ejp/count/' + dateString)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        res.should.be.json;

        should.exist(res.body.north);
        should.exist(res.body.paca);
        should.exist(res.body.west);
        should.exist(res.body.south);

        done();
      });
    });

  });
});