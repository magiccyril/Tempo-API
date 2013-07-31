
/**
 * Module dependencies.
 */

var mongoose       = require('mongoose')
  , extend         = require('mongoose-schema-extend')
  , env            = process.env.NODE_ENV || 'development'
  , config         = require('../../config/config')[env]
  , ForecastSchema = require('./forecast');

/**
 * Tempo Schema
 */

var TempoSchema = ForecastSchema.extend({
  color: {
    default: 'blue',
    enum: ['blue', 'white', 'red'],
    required: true,
    type: String
  }
});


/**
 * Statics
 */

/**
 * Count all values given in parameters
 *
 * @param  {array}    data     array of tempos objects to count
 * @param  {function} callback callback
 * @return {object}            object with all colors with the sum for each
 */
TempoSchema.statics.count = function (data, callback) {
  if (!data || !callback) {
    throw new Error('Invalid parameters');
  }

  var colors = {
    'blue': 0,
    'white': 0,
    'red': 0
  };

  for (var i in data) {
    var tempo = data[i];

    if (tempo.color) {
      colors[tempo.color]++;
    }
  }

  callback(null, colors);
};

/**
 * Get start date of the year
 *
 * @param  {function} callback
 */
TempoSchema.statics.getStartDate = function (callback) {
  var now = new Date();

  var date = new Date(now.getFullYear(), config.tempo.start.month - 1, config.tempo.start.day);

  if (now.getMonth() < date.getMonth()) {
    date.setFullYear(date.getFullYear() - 1);
  }

  callback(null, date);
};

/**
 * Get Javascript Dates for today and tomorrow
 * @param  {function} callback
 */
TempoSchema.statics.getTodayAndTomorrow = function (callback) {
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
};

mongoose.model('Tempo', TempoSchema);

module.exports = TempoSchema;
