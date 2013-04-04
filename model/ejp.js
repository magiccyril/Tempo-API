var mongoose       = require('mongoose')
  , extend         = require('mongoose-schema-extend')
  , ForecastSchema = require('./forecast').schema
  , utils          = require('../lib/utils');

/**
 * Schema
 */
var schema = ForecastSchema.extend({
  ejp: {
    north: {
      default: false,
      required: true,
      type: Boolean
    },
    paca: {
      default: false,
      required: true,
      type: Boolean
    },
    west: {
      default: false,
      required: true,
      type: Boolean
    },
    south: {
      default: false,
      required: true,
      type: Boolean
    }
  }
});

var model = mongoose.model('ejp', schema);

module.exports = {
  'model': model,
  'schema': schema
};