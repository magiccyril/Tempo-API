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

  it('should have false as default ejp value', function() {
    ejp.ejp.should.exist;
    ejp.ejp.north.should.exist;
    ejp.ejp.paca.should.exist;
    ejp.ejp.west.should.exist;
    ejp.ejp.south.should.exist;

    ejp.ejp.north.should.be.a('boolean').and.equal(false);
    ejp.ejp.paca.should.be.a('boolean').and.equal(false);
    ejp.ejp.west.should.be.a('boolean').and.equal(false);
    ejp.ejp.south.should.be.a('boolean').and.equal(false);
  });
});