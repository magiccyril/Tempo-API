var mongoose = require("mongoose")
  , config   = require('../../config')
  , Forecast = require('../../model').Forecast
  , should   = require('should')
  , async    = require('async');

/**
 * Utilities
 */

describe('Forecast', function() {

  describe('Date conversion function', function() {
    it('should convert YYYY-MM-DD string to an object representing the date', function() {
      var date = Forecast.parseDate('2012-09-09');

      date.should.be.a('object');
      date.year.should.equal(2012);
      date.month.should.equal(9);
      date.day.should.equal(9);
    });

    it('should convert YYYY-MM string to an object representing the date', function() {
      var date = Forecast.parseDate('2012-09');

      date.should.be.a('object');
      date.year.should.equal(2012);
      date.month.should.equal(9);
      should.not.exist(date.day);
    });

    it('should convert YYYY string to an object representing the date', function() {
      var date = Forecast.parseDate('2012');

      date.should.be.a('object');
      date.year.should.equal(2012);
      should.not.exist(date.month);
      should.not.exist(date.day);
    });

    it('should convert Javascript Date to an object representing the date', function() {
      var input = new Date();
      input.setFullYear(2012);
      input.setMonth(9 - 1);
      input.setDate(9);

      var date = Forecast.parseDate(input);

      date.should.be.a('object');
      date.year.should.equal(2012);
      date.month.should.equal(9);
      date.day.should.equal(9);
    });
  });

  describe('Dates', function() {
    var forecast = null;

    beforeEach(function(){
      forecast = new Forecast();
    });

    it('should have a default date and it should equal now', function() {
      var now = new Date();

      forecast.date.should.be.ok;
      forecast.date.year.should.equal(now.getFullYear());
      forecast.date.month.should.equal(now.getMonth() + 1);
      forecast.date.day.should.equal(now.getDate());
    });

    it('should format date like "YYYY-MM-DD"', function() {
      forecast.date.year = 2012;
      forecast.date.month = 9;
      forecast.date.day = 9;

      forecast.dateFormated().should.be.a('string').and.equal('2012-09-09');
    });

    it('should allow to set YYYY-MM-DD string as date and allow chaining', function() {
      forecast.setDate('2012-09-09').should.be.a('object');

      forecast.date.year.should.equal(2012);
      forecast.date.month.should.equal(9);
      forecast.date.day.should.equal(9);
    });

    it('should allow to set date object as date and allow chaining', function() {
      var date = {
        year: 2012,
        month: 9,
        day: 9
      };
      forecast.setDate(date).should.be.a('object');

      forecast.date.year.should.equal(2012);
      forecast.date.month.should.equal(9);
      forecast.date.day.should.equal(9);
    });

    it('should allow to set Javascript Date() object as date and allow chaining', function() {
      var date = new Date();
      date.setFullYear(2012);
      date.setMonth(9 - 1);
      date.setDate(9);
      forecast.setDate(date).should.be.a('object');

      forecast.date.year.should.equal(2012);
      forecast.date.month.should.equal(9);
      forecast.date.day.should.equal(9);
    });

    it('should throw an error if year is < 0', function(done) {
      forecast.date.year = -1;
      forecast.save(function(err) {
        err.should.be.ok;
        err.errors.should.have.keys('date.year');
        err.errors['date.year'].type.should.equal('min');

        done();
      });
    });

    it('should throw an error if month is <= 0', function(done) {
      forecast.date.month = 0;
      forecast.save(function(err) {
        err.should.be.ok;
        err.errors.should.have.keys('date.month');
        err.errors['date.month'].type.should.equal('min');

        done();
      });
    });

    it('should throw an error if month is > 12', function(done) {
      forecast.date.month = 13;
      forecast.save(function(err) {
        err.should.be.ok;
        err.errors.should.have.keys('date.month');
        err.errors['date.month'].type.should.equal('max');

        done();
      });
    });

    it('should throw an error if day is <= 0', function(done) {
      forecast.date.day = 0;
      forecast.save(function(err) {
        err.should.be.ok;
        err.errors.should.have.keys('date.day');
        err.errors['date.day'].type.should.equal('min');

        done();
      });
    });

    it('should throw an error if day is > 31', function(done) {
      forecast.date.day = 32;
      forecast.save(function(err) {
        err.should.be.ok;
        err.errors.should.have.keys('date.day');
        err.errors['date.day'].type.should.equal('max');

        done();
      });
    });

    it('should throw an error if date is invalid', function(done) {
      // 2011 isn't a leap year.
      forecast.date.day = 29;
      forecast.date.month = 0;
      forecast.date.year = 2011;

      forecast.save(function(err) {
        err.should.be.ok;
        err.should.be.an.instanceOf(Error);

        done();
      });
    });
  });

  describe('Queries', function() {
    var year      = 1985;
    var testDate  = {
      year: year,
      month: 1,
      day: 18
    };

    beforeEach(function (done) {
      var date = new Date();
      date.setFullYear(year - 1);
      date.setMonth(9 - 1);
      date.setDate(1);

      for (var i = 0; i < 365; i++) {
        var forecast = new Forecast();
        forecast.date.year  = date.getFullYear();
        forecast.date.month = date.getMonth() + 1;
        forecast.date.day   = date.getDate();
        forecast.save();

        date.setDate(date.getDate() + 1);
      }

      done();
    });

    afterEach(function (done) {
      var deleteYear = function (year) {
        return function (callback) {
          Forecast.where('date.year', year).remove(function(err) {
            if (err) {
              callback(err);
            }

            callback(null);
          });
        }
      }

      async.parallel([deleteYear(year - 1), deleteYear(year)], function(err) {
        if (err) {
          return done(err);
        };

        done();
      });
    });

    it('should have a function to retreive one object by date', function(done) {
      Forecast.findOneByDate.should.be.a('function');
      Forecast.findOneByDate(testDate, function(err, forecast) {
        if (err) {
          return done(err);
        }

        forecast.should.be.ok;
        forecast.date.year.should.equal(testDate.year);
        forecast.date.month.should.equal(testDate.month);
        forecast.date.day.should.equal(testDate.day);

        done();
      });
    });

    it('should have a function to retreive objects by day', function(done) {
      Forecast.findByDate.should.be.a('function');
      Forecast.findByDate(testDate, function(err, data) {
        if (err) {
          return done(err);
        }

        data.should.be.ok.and.not.be.empty;
        data.forEach(function(forecast) {
          forecast.date.year.should.equal(testDate.year);
          forecast.date.month.should.equal(testDate.month);
          forecast.date.day.should.equal(testDate.day);
        });

        done();
      });
    });

    it('should have a function to retreive objects by month', function(done) {
      Forecast.findByDate.should.be.a('function');
      var testByMonth = testDate.year +'-'+ testDate.month;
      Forecast.findByDate(testByMonth, function(err, data) {
        if (err) {
          return done(err);
        }

        data.should.be.ok.and.not.be.empty;
        data.length.should.be.within(2, 31);
        data.forEach(function(forecast) {
          forecast.date.year.should.equal(testDate.year);
          forecast.date.month.should.equal(testDate.month);
        });

        done();
      });
    });

    it('should have a function to retreive objects by year', function(done) {
      Forecast.findByDate.should.be.a('function');
      Forecast.findByDate(testDate.year, function(err, data) {
        if (err) {
          return done(err);
        }

        data.should.be.ok.and.not.be.empty;
        // 243 = from january 1 to august 31
        data.length.should.be.equal(243);
        data.forEach(function(forecast) {
          forecast.date.year.should.equal(testDate.year);
        });

        done();
      });
    });

    it('should have a function to retreive objects by range', function(done) {
      var startDate = {
        year: year - 1,
        month: 9,
        day: 1
      };
      var endDate = {
        year: year,
        month: 1,
        day: 18
      };

      Forecast.findByDateRange.should.be.a('function');
      Forecast.findByDateRange(startDate, endDate, function(err, data) {
        if (err) {
          return done(err);
        }

        data.should.be.ok.and.not.be.empty;
        // 140 = from year - 1 september 1 to january 18
        data.length.should.be.equal(140);

        done();
      });
    });

  });
});