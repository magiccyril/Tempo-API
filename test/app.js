var request = require('supertest')
  , express = require('express')
  , assert  = require('assert')
  , app     = require('../app');

describe('POST /forecast', function() {
  it('respond OK', function(done) {
    request(app)
      .post('/forecast')
      .expect(200, done);
  })
});