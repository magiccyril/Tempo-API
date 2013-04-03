var mongoose = require('mongoose'),
    extend   = require('mongoose-schema-extend'),
    utils    = require('../lib/utils.js');

/**
 * Schema
 */
var schema = new mongoose.Schema({
  date: {
    year: {
      default: utils.defaultYear,
      index: true,
      min: 0,
      required: true,
      type: Number
    },
    month: {
      default: utils.defaultMonth,
      index: true,
      max: 12,
      min: 1,
      required: true,
      type: Number
    },
    day: {
      default: utils.defaultDay,
      index: true,
      max: 31,
      min: 1,
      required: true,
      type: Number
    }
  }
});

schema.pre('save', function (next) {
  var date = new Date(this.date.year, this.date.month - 1, this.date.day);
  var valid = date.getFullYear() === this.date.year &&
              date.getMonth() + 1 === this.date.month &&
              date.getDate() === this.date.day;

  if (!valid) {
    var err = new Error('Date invalid');
    next(err);
  }

  next();
});

/**
 * Methods
 */
schema.method({
  dateFormated: function () {
    var year = utils.pad(this.date.year, 4);
    var month = utils.pad(this.date.month, 2);
    var day = utils.pad(this.date.day, 2);

    return ''+ year + '-' + month + '-' + day;
  },

  setDate: function(data) {
    var date = Forecast.parseDate(data);

    this.date.year  = date.year;
    this.date.month = date.month;
    this.date.day   = date.day;

    return this;
  }
});

/**
 * Statics
 */

schema.static('findOneByDate', function (date, callback) {
  if (!date || !callback) {
    throw new Error('Invalid parameters');
  }

  date = Forecast.parseDate(date);

  return this.findOne()
    .where('date.year', date.year)
    .where('date.month', date.month)
    .where('date.day', date.day)
    .exec(callback);
});

schema.static('findByDate', function (date, callback) {
  if (!date || !callback) {
    throw new Error('Invalid parameters');
  }

  date = Forecast.parseDate(date);

  var query = this.find();
  if (date.year) {
    query.where('date.year', date.year);
  }
  if (date.month) {
    query.where('date.month', date.month);
  }
  if (date.day) {
    query.where('date.day', date.day);
  }

  return query.exec(callback);
});

schema.static('findByDateRange', function (startDate, endDate, callback) {
  if (!startDate || !endDate || !callback) {
    throw new Error('Invalid parameters');
  }

  startDate = Forecast.parseDate(startDate);
  endDate = Forecast.parseDate(endDate);

  var condition = Array();
  var dates = utils.getDatesBetweenDates(startDate, endDate);
  for (var i in dates) {
    var date = dates[i];
    if (date.year && date.month && date.day) {
      condition.push({
        'date.year': date.year,
        'date.month': date.month,
        'date.day': date.day
      });
    }
  }

  return this.find({ $or: condition }).exec(callback);
});

schema.static('parseDate', function (data) {
  if (utils.dateObjectValid(data)) {
    return data;
  }

  var dateArray = Array();
  if ('number' === typeof data) {
    dateArray.push(data);
  }
  else if ('string' === typeof data) {
    dateArray = data.split('-');
  }
  else if (data instanceof Date) {
    dateArray = utils.jsDateToArray(data);
  }
  else {
    throw Error('invalid arguments');
  }

  var date = utils.arrayToDateObject(dateArray);

  if (!utils.dateObjectValid(date)) {
    throw Error('invalid arguments');
  }

  return date;
});

/**
 * Model
 */
var Forecast = mongoose.model('forecast', schema);

module.exports = {
  'model': Forecast,
  'schema': schema
};