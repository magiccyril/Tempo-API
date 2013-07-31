var mongoose = require("mongoose")
  , config   = require('../../config')
  , Ejp      = require('../../model').Ejp
  , should   = require('should')
  , async    = require('async');


describe('Ejp Model', function() {

  var ejp = null;

  beforeEach(function(){
    ejp = new Ejp();
  });

  it('should have false as default zones value', function() {
    ejp.zones.should.exist;
    ejp.zones.north.should.exist;
    ejp.zones.paca.should.exist;
    ejp.zones.west.should.exist;
    ejp.zones.south.should.exist;

    ejp.zones.north.should.be.a('boolean').and.equal(false);
    ejp.zones.paca.should.be.a('boolean').and.equal(false);
    ejp.zones.west.should.be.a('boolean').and.equal(false);
    ejp.zones.south.should.be.a('boolean').and.equal(false);
  });

  it('should have a static method to get today and tomorrow dates', function(done) {
    Ejp.getTodayAndTomorrow(function (err, dates) {
      var now = new Date();

      should.exist(dates.today);
      should.exist(dates.tomorrow);

      if (now.getHours() < 6) {
        dates.today.getDate().should.equal(now.getDate() - 1);
      }
      else {
        dates.today.getDate().should.equal(now.getDate());
      }

      var tomorrowDate = new Date(dates.today.getTime());
      tomorrowDate.setDate(dates.today.getDate() + 1);
      dates.tomorrow.getDate().should.equal(tomorrowDate.getDate());

      done();
    });
  });

  it('should have a static method to get start date of the year', function(done) {
    Ejp.getStartDate(function (err, date) {
      var now = new Date();

      if (now.getMonth() < date.getMonth()) {
        date.getFullYear().should.equal(now.getFullYear() - 1);
      }
      else {
        date.getFullYear().should.equal(now.getFullYear());
      }
      date.getMonth().should.equal(config.get('ejp:start:month') - 1);
      date.getDate().should.equal(config.get('ejp:start:day'));

      done();
    });
  })
});