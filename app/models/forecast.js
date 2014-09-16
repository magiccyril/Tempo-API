
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , utils    = require('../../lib/utils');

/**
 * Forecast Schema
 */
var ForecastSchema = new mongoose.Schema({
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

ForecastSchema.set('toObject', {
  transform: function (doc, ret, options) {
    // remove the _id of every document before returning the result
    delete ret._id;
    delete ret.__v;
  }
});

/**
 * Pre-save hook
 */

ForecastSchema.pre('save', function (next) {
  var date  = new Date(this.date.year, this.date.month - 1, this.date.day);
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

ForecastSchema.method({
  dateFormated: function () {
    var year  = utils.rightPad(this.date.year, 4, '0');
    var month = utils.rightPad(this.date.month, 2, '0');
    var day   = utils.rightPad(this.date.day, 2, '0');

    return '' + year + '-' + month + '-' + day;
  },

  setDate: function(data) {
    var date = this.model(this.constructor.modelName).parseDate(data);

    this.date.year  = date.year;
    this.date.month = date.month;
    this.date.day   = date.day;

    return this;
  },

  clone: function() {
    var copy = this.constructor();
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
    }

    return copy;
  },

  render: function() {
    var output = this.toObject();
console.log(output);

    return output;
  }
});

/**
 * Statics
 */

ForecastSchema.statics = {

  findOneByDate: function (date, callback) {
    if (!date || !callback) {
      throw new Error('Invalid parameters');
    }

    date = this.parseDate(date);

    return this.findOne()
      .where('date.year', date.year)
      .where('date.month', date.month)
      .where('date.day', date.day)
      .exec(callback);
  },

  findByDate: function (date, callback) {
    if (!date || !callback) {
      throw new Error('Invalid parameters');
    }

    date = this.parseDate(date);

    var query = this.find();
    if (date.day) {
      query.where('date.day', date.day);
    }
    if (date.month) {
      query.where('date.month', date.month);
    }
    if (date.year) {
      query.where('date.year', date.year);
    }

    query.exec(callback);
  },

  findByDateRange: function (startDate, endDate, callback) {
    if (!startDate || !endDate || !callback) {
      throw new Error('Invalid parameters');
    }

    startDate = this.parseDate(startDate);
    endDate = this.parseDate(endDate);

    var condition = Array();
    var dates     = utils.getDatesBetweenDates(startDate, endDate);
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

    this.find({ $or: condition }).exec(callback);
  },

  parseDate: function (data) {
    if (utils.dateObjectValid(data)) {
      return data;
    }

    var dateArray = Array();
    if ('number' === typeof data) {
      dateArray.push(data);
    }

    if ('string' === typeof data) {
      dateArray = data.split('-');
    }

    if (data instanceof Date) {
      dateArray = utils.jsDateToArray(data);
    }

    if (0 === dateArray.length) {
      throw Error('invalid arguments');
    }

    var date = utils.arrayToDateObject(dateArray);

    if (!utils.dateObjectValid(date)) {
      throw Error('invalid arguments');
    }

    return date;
  }
};

mongoose.model('Forecast', ForecastSchema);

module.exports = ForecastSchema;
