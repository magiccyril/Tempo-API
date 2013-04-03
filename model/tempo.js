var mongoose = require('mongoose'),
    extend   = require('mongoose-schema-extend')
    ForecastSchema = require('./forecast').schema;
var utils = require('../lib/utils');

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

var Tempo = mongoose.model('tempo', schema);

module.exports = {
  'model': Tempo,
  'schema': schema
};