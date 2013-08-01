
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should   = require('should')
  , request  = require('supertest')
  , app      = require('../../app')
  , async    = require('async')
  , utils    = require('../../lib/utils')
  , agent    = request.agent(app);

/**
 * Index functional tests
 */

describe('Editorial content', function() {

  it('404 should be a Json', function(done) {
    agent
    .post('/404')
    .expect(404)
    .expect('Content-Type', /json/)
    .end(done);
  });

});