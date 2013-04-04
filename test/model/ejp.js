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
});