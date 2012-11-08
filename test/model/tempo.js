var mongoose = require("mongoose")
  , config   = require('../../config')
  , Tempo    = require('../../model').Tempo
  , should   = require('should');

//tell Mongoose to use a different DB
//mongoose.connect(config.getConnectionString('_test'));

describe('Tempo', function(){
  // holds a tempo object to use in the each test
  var tempo = null;

  beforeEach(function(){
    tempo = new Tempo();
  });

  it('should have a default day', function() {
    tempo.day.should.exist;
    tempo.day.should.be.ok;
  });

  it('should have "blue" as default color', function() {
    tempo.color.should.exist;
    tempo.color.should.be.a('string').and.equal('blue');
  });
});