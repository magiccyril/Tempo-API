var mongoose = require("mongoose")
  , config   = require('../../config')
  , Tempo    = require('../../model').Tempo
  , should   = require('should')
  , async    = require('async');

/**
 * Utilities
 */
function getRandomColor() {
  var i = Math.floor(Math.random() * 3);
  switch (i) {
    case 0:
      return 'blue';
    case 1:
      return 'white';
    case 2:
      return 'red';
  }
}

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

});