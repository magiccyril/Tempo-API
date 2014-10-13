
/**
 * Module dependencies.
 */

var should   = require('should')
  , request  = require('supertest')
  , app      = require('../../app')
  , async    = require('async')
  , utils    = require('../../lib/utils')
  , agent    = request.agent(app)
  , env      = process.env.NODE_ENV || 'test'
  , config   = require('../../config/config')[env];

/**
 * Cron functional tests
 */

describe('Cron', function() {

  describe('GET /cron', function() {
    it('should have a URL to exectue a command and respond OK', function(done) {
      agent
      .get('/cron')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        res.should.equal("hello\r\n");

        done();
    });

  });
});