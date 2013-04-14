var mongoose = require("mongoose")
  , config   = require('../../config')
  , Tempo    = require('../../model').Tempo
  , should   = require('should')
  , async    = require('async');


describe('Tempo Model', function() {

  var tempo = null;

  beforeEach(function(){
    tempo = new Tempo();
  });

  it('should have "blue" as default color', function() {
    tempo.color.should.exist;
    tempo.color.should.be.a('string').and.equal('blue');
  });

  it('should throw an error if tempo color is invalid', function(done) {
    tempo.color = 'yellow';
    tempo.save(function(err) {
      err.should.be.ok;
      err.errors.should.have.keys('color');
      err.errors['color'].type.should.equal('enum');

      done();
    });
  });

  it('should have a static method to get today and tomorrow dates', function(done) {
    Tempo.getTodayAndTomorrow(function (err, dates) {
      var now = new Date();

      should.exist(dates.today);
      should.exist(dates.tomorrow);

      if (now.getHours() < 6) {
        dates.today.getDate().should.equal(now.getDate() - 1);
      }
      else {
        dates.today.getDate().should.equal(now.getDate());
      }

      dates.tomorrow.getDate().should.equal(dates.today.getDate() + 1);

      done();
    });
  });

  it('should have a static method to get start date of the year', function(done) {
    Tempo.getStartDate(function (err, date) {
      var now = new Date();

      if (now.getMonth() < date.getMonth()) {
        date.getFullYear().should.equal(now.getFullYear() - 1);
      }
      else {
        date.getFullYear().should.equal(now.getFullYear());
      }
      date.getMonth().should.equal(config.get('tempo:start:month') - 1);
      date.getDate().should.equal(config.get('tempo:start:day'));

      done();
    });
  });

});