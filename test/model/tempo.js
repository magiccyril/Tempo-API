var mongoose = require("mongoose")
  , config   = require('../../config')
  , Tempo    = require('../../model').Tempo
  , should   = require('should');

describe('Tempo Schema', function() {

  describe('Conversion function', function() {
    it('should convert YYYY-MM-DD string to an object representing the date', function() {
      var date = Tempo.parseDate('2012-09-09');

      date.should.be.a('object');
      date.year.should.equal(2012);
      date.month.should.equal(9);
      date.day.should.equal(9);
    });

    it('should convert YYYY-MM string to an object representing the date', function() {
      var date = Tempo.parseDate('2012-09');

      date.should.be.a('object');
      date.year.should.equal(2012);
      date.month.should.equal(9);
      should.not.exist(date.day);
    });

    it('should convert YYYY string to an object representing the date', function() {
      var date = Tempo.parseDate('2012');

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

      var date = Tempo.parseDate(input);

      date.should.be.a('object');
      date.year.should.equal(2012);
      date.month.should.equal(9);
      date.day.should.equal(9);
    });
  });

  describe('Queries', function() {
    var testTempo = null;
    var testDate = null;

    beforeEach(function(done) {
      testDate = {
        year: 1985,
        month: 1,
        day: 18
      };

      testTempo = new Tempo({date: testDate});

      testTempo.save(function(err) {
        if (err) {
          return done(err);
        }

        done();
      });
    });

    afterEach(function() {
      testTempo.remove();
    });

    it('should have a function to retreive one object by date', function(done) {
      Tempo.findOneByDate.should.be.a('function');
      Tempo.findOneByDate(testDate, function(err, tempo) {
        if (err) {
          return done(err);
        }

        tempo.should.be.ok;
        tempo.date.year.should.equal(testDate.year);
        tempo.date.month.should.equal(testDate.month);
        tempo.date.day.should.equal(testDate.day);

        done();
      });
    });

    it('should have a function to retreive objects by day', function(done) {
      Tempo.findByDate.should.be.a('function');
      Tempo.findByDate(testDate, function(err, data) {
        if (err) {
          return done(err);
        }

        data.should.be.ok.and.not.be.empty;
        data.forEach(function(tempo) {
          tempo.date.year.should.equal(testDate.year);
          tempo.date.month.should.equal(testDate.month);
          tempo.date.day.should.equal(testDate.day);
        });

        done();
      });
    });

    it('should have a function to retreive objects by month', function(done) {
      Tempo.findByDate.should.be.a('function');
      var testByMonth = testDate.year +'-'+ testDate.month;
      Tempo.findByDate(testByMonth, function(err, data) {
        if (err) {
          return done(err);
        }

        data.should.be.ok.and.not.be.empty;
        data.forEach(function(tempo) {
          tempo.date.year.should.equal(testDate.year);
          tempo.date.month.should.equal(testDate.month);
        });

        done();
      });
    });

    it('should have a function to retreive objects by year', function(done) {
      Tempo.findByDate.should.be.a('function');
      Tempo.findByDate(testDate.year, function(err, data) {
        if (err) {
          return done(err);
        }

        data.should.be.ok.and.not.be.empty;
        data.forEach(function(tempo) {
          tempo.date.year.should.equal(testDate.year);
        });

        done();
      });
    });

    it('should have a function to retreive objects by range', function(done) {
      var startDate = testDate;
      startDate.day = testDate.day - 1;
      var endDate = testDate;
      endDate.day = testDate.day + 1;

      Tempo.findByDate.should.be.a('function');

      Tempo.findByDate(startDate, endDate, function(err, data) {
        if (err) {
          return done(err);
        }

        data.should.be.ok.and.not.be.empty;
        data.forEach(function(tempo) {
          tempo.date.year.should.equal(testDate.year);
          tempo.date.month.should.equal(testDate.month);
          tempo.date.day.should.be.within(testDate.day - 1, testDate.day + 1);
        });

        done();
      });
    });

  });

});

describe('Tempo Model', function() {

  var tempo = null;

  beforeEach(function(){
    tempo = new Tempo();
  });

  describe('Dates', function() {
    it('should have a default date and it should equal now', function() {
      var now = new Date();

      tempo.date.should.be.ok;
      tempo.date.year.should.equal(now.getFullYear());
      tempo.date.month.should.equal(now.getMonth() + 1);
      tempo.date.day.should.equal(now.getDate());
    });

    it('should format date like "YYYY-MM-DD"', function() {
      tempo.date.year = 2012;
      tempo.date.month = 9;
      tempo.date.day = 9;

      tempo.dateFormated().should.be.a('string').and.equal('2012-09-09');
    });

    it('should allow to set YYYY-MM-DD string as date and allow chaining', function() {
      tempo.setDate('2012-09-09').should.be.a('object');

      tempo.date.year.should.equal(2012);
      tempo.date.month.should.equal(9);
      tempo.date.day.should.equal(9);
    });

    it('should allow to set date object as date and allow chaining', function() {
      var date = {
        year: 2012,
        month: 9,
        day: 9
      };
      tempo.setDate(date).should.be.a('object');

      tempo.date.year.should.equal(2012);
      tempo.date.month.should.equal(9);
      tempo.date.day.should.equal(9);
    });

    it('should allow to set Javascript Date() object as date and allow chaining', function() {
      var date = new Date();
      date.setFullYear(2012);
      date.setMonth(9 - 1);
      date.setDate(9);
      tempo.setDate(date).should.be.a('object');

      tempo.date.year.should.equal(2012);
      tempo.date.month.should.equal(9);
      tempo.date.day.should.equal(9);
    });

    it('should throw an error if year is < 0', function(done) {
      tempo.date.year = -1;
      tempo.save(function(err) {
        err.should.be.ok;
        err.errors.should.have.keys('date.year');
        err.errors['date.year'].type.should.equal('min');

        done();
      });
    });

    it('should throw an error if month is <= 0', function(done) {
      tempo.date.month = 0;
      tempo.save(function(err) {
        err.should.be.ok;
        err.errors.should.have.keys('date.month');
        err.errors['date.month'].type.should.equal('min');

        done();
      });
    });

    it('should throw an error if month is > 12', function(done) {
      tempo.date.month = 13;
      tempo.save(function(err) {
        err.should.be.ok;
        err.errors.should.have.keys('date.month');
        err.errors['date.month'].type.should.equal('max');

        done();
      });
    });

    it('should throw an error if day is <= 0', function(done) {
      tempo.date.day = 0;
      tempo.save(function(err) {
        err.should.be.ok;
        err.errors.should.have.keys('date.day');
        err.errors['date.day'].type.should.equal('min');

        done();
      });
    });

    it('should throw an error if day is > 31', function(done) {
      tempo.date.day = 32;
      tempo.save(function(err) {
        err.should.be.ok;
        err.errors.should.have.keys('date.day');
        err.errors['date.day'].type.should.equal('max');

        done();
      });
    });

    it('should throw an error if date is invalid', function(done) {
      // 2011 isn't a leap year.
      tempo.date.day = 29;
      tempo.date.month = 0;
      tempo.date.year = 2011;

      tempo.save(function(err) {
        err.should.be.ok;
        err.should.be.an.instanceOf(Error);

        done();
      });
    });
  });

  describe('Color', function() {
    it('should have "blue" as default color', function() {
      tempo.color.should.exist;
      tempo.color.should.be.a('string').and.equal('blue');
    });
  });

});