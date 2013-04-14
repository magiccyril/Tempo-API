var mongoose       = require('mongoose')
  , extend         = require('mongoose-schema-extend')
  , ForecastSchema = require('./forecast').schema
  , utils          = require('../lib/utils')
  , config         = require('../config');

/**
 * Schema
 */
var schema = ForecastSchema.extend({
  zones: {
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

/**
 * Count all values given in parameters
 *
 * @param  {array}    data     array of ejp objects to count
 * @param  {function} callback callback
 * @return {object}            object with all zones with the sum for each
 */
schema.static('count', function (data, callback) {
  if (!data || !callback) {
    throw new Error('Invalid parameters');
  }

  var zones = {
    'north': 0,
    'paca': 0,
    'west': 0,
    'south': 0
  };

  for (var i in data) {
    var ejp = data[i];

    if (ejp.zones) {
      for (var zone in zones) {
        if (true === ejp.zones[zone]) {
          zones[zone]++;
        }
      }
    }
  }

  callback(null, zones);
});

/**
 * Get Javascript Dates for today and tomorrow
 * @param  {function} callback
 */
schema.static('getTodayAndTomorrow', function (callback) {
  var today = new Date();
  if (today.getHours() < 6) {
    today.setDate(today.getDate() - 1);
  }
  var tomorrow = new Date(today.getTime());
  tomorrow.setDate(tomorrow.getDate() + 1);

  callback(null, {
    'today': today,
    'tomorrow': tomorrow
  });
});

/**
 * Get start date of the year
 *
 * @param  {function} callback
 */
schema.static('getStartDate', function (callback) {
  var now = new Date();

  var date = new Date(now.getFullYear(), config.get('ejp:start:month') - 1, config.get('ejp:start:day'));

  if (now.getMonth() < date.getMonth()) {
    date.setFullYear(date.getFullYear() - 1);
  }

  callback(null, date);
});

var model = mongoose.model('ejp', schema);

module.exports = {
  'model': model,
  'schema': schema
};