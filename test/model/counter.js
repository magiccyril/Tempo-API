var mongoose = require("mongoose")
  , config   = require('../../config')
  , Counter    = require('../../model').Counter
  , should   = require('should');

describe('Counter Model', function() {

  var counter = null;

  beforeEach(function(){
    counter = new Counter({
      currentValue: 123,
      name:         'test-counter',
      startMonth:   9,
      startDay:     1,
      startValue:   200
    });
  });

  describe('Creation', function() {

    it('should have a name', function() {
      should.exist(counter.name);
      counter.name.should.be.a('string');
    });

    it('should have a current value', function() {
      should.exist(counter.currentValue);
      counter.currentValue.should.be.a('number');
    });

    it('should have a start month and day, and a start value', function() {
      should.exist(counter.startMonth);
      should.exist(counter.startDay);
      should.exist(counter.startValue);

      counter.startMonth.should.be.a('number');
      counter.startDay.should.be.a('number');
      counter.startValue.should.be.a('number');
    });

    it('should have current value within 0 and start value', function(done) {
      counter.currentValue.should.be.within(0, counter.startValue);

      counter.startValue = 1;

      counter.save(function(err) {
        err.should.be.ok;
        done();
      });
    });

    it('should have a method to decrease current value', function() {
      should.exist(counter.decrease);
      counter.decrease.should.be.a('function');

      var pastValue = counter.currentValue;
      counter.decrease();

      counter.currentValue.should.equal(pastValue - 1);
    });

    it('should have a method to reset current value', function() {
      should.exist(counter.reset);
      counter.reset.should.be.a('function');

      counter.reset();

      counter.currentValue.should.equal(counter.startValue);
    });

  });

});