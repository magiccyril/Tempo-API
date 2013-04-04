var mongoose       = require('mongoose')
  , extend         = require('mongoose-schema-extend')
  , ForecastSchema = require('./forecast').schema
  , utils          = require('../lib/utils');

/**
 * Schema
 */
var schema = ForecastSchema.extend({
  color: {
    default: 'blue',
    enum: ['blue', 'white', 'red'],
    required: true,
    type: String
  }
});

var model = mongoose.model('tempo', schema);

module.exports = {
  'model': model,
  'schema': schema
};