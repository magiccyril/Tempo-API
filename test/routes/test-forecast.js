
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should   = require('should')
  , request  = require('supertest')
  , app      = require('../../app')
  , async    = require('async')
  , Ejp      = mongoose.model('Ejp')
  , Tempo    = mongoose.model('Tempo')
  , utils    = require('../../lib/utils')
  , agent    = request.agent(app);

/*
 * Utilies
 */

function fetchTodayAndTomorrowDatesFactory(Model) {
  return function(callback) {
    Model.getTodayAndTomorrow(callback);
  }
}

function createEjpFactory(date) {
  return function(callback) {
    var ejp = new Ejp({
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      },
      zones: {
        north: utils.getRandomBoolean(),
        paca: utils.getRandomBoolean(),
        west: utils.getRandomBoolean(),
        south: utils.getRandomBoolean()
      }
    });

    ejp.save(function(err) {
      callback(err, ejp);
    });
  }
}

function createTempoFactory(date) {
  return function(callback) {
    var tempo = new Tempo({
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      },
      color: utils.getRandomColor()
    });

    tempo.save(function(err) {
      callback(err, tempo);
    });
  }
}

/**
 * Forecast functional tests
 */

describe('Forecast API', function() {
  var dates         = null;
  var ejpToday      = null;
  var ejpTomorrow   = null;
  var tempoToday    = null;
  var tempoTomorrow = null;

  beforeEach(function(done) {
    var getDatesTasks = {
      tempo: fetchTodayAndTomorrowDatesFactory(Tempo),
      ejp:   fetchTodayAndTomorrowDatesFactory(Ejp)
    };

    async.parallel(getDatesTasks, function(err, dates) {
      var tasks = {
      ejpToday: createEjpFactory(dates.ejp.today),
      ejpTomorrow: createEjpFactory(dates.ejp.tomorrow),
      tempoToday: createTempoFactory(dates.tempo.today),
      tempoTomorrow: createTempoFactory(dates.tempo.tomorrow),
    };

    async.parallel(tasks, function(err, results) {
      if (err) {
        return done(err);
      };

      ejpToday      = results.ejpToday;
      ejpTomorrow   = results.ejpTomorrow;
      tempoToday    = results.tempoToday;
      tempoTomorrow = results.tempoTomorrow;

      done();
    });
    });
  });

  afterEach(function(done) {
    ejpToday.remove();
    ejpTomorrow.remove();

    tempoToday.remove();
    tempoTomorrow.remove();

    done();
  });

  describe('GET /forecast', function() {
    it('should respond a JSON with today and tomorrow data', function(done) {
      agent
      .get('/forecast')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        res.should.be.json;

        should.exist(res.body.today);
        should.exist(res.body.today.tempo);
        should.exist(res.body.today.ejp);

        should.exist(res.body.tomorrow);
        should.exist(res.body.tomorrow.tempo);
        should.exist(res.body.tomorrow.ejp);

        done();
      });
    });
  });

  describe('GET /forecast-with-counters', function() {
    it('should respond a JSON with today and tomorrow data + counters', function(done) {
      agent
      .get('/forecast-with-counters')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        res.should.be.json;

        should.exist(res.body.today);
        should.exist(res.body.today.tempo);
        should.exist(res.body.today.ejp);

        should.exist(res.body.tomorrow);
        should.exist(res.body.tomorrow.tempo);
        should.exist(res.body.tomorrow.ejp);

        should.exist(res.body.count);

        should.exist(res.body.count.tempo);
        var countTempo = res.body.count.tempo;
        should.exist(countTempo.blue);
        should.exist(countTempo.white);
        should.exist(countTempo.red);
        var countTempoTotal = countTempo.blue + countTempo.white + countTempo.red;
        countTempoTotal.should.equal(1);

        should.exist(res.body.count.ejp);
        var countEjp = res.body.count.ejp;
        should.exist(countEjp.north);
        should.exist(countEjp.paca);
        should.exist(countEjp.west);
        should.exist(countEjp.south);

        done();
      });
    });
  });

});