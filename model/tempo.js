var mongoose = require('mongoose');

/**
 * Helpers functions
 */
function pad (number, length) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }

  return str;
}

Array.prototype.pad = function (padSize, padValue) {
  var length = Math.abs(padSize) - this.length;
  var array = [].concat(this);
  if (length <= 0) {
    return array;
  }
  for(var i = 0; i < length; i++) {
    padSize < 0 ? array.unshift(padValue) : array.push(padValue);
  }

  return array;
};

function datePad(date) {
  if (!date.year) {
    var jsDate = new Date();
    date.year = jsDate.getFullYear();
  }

  if (!date.month) {
    date.month = 1;
  }

  if (!date.day) {
    date.day = 1;
  }

  return date;
}

/**
 * Date conversion tools
 */
function jsDateToArray (date) {
  var array = Array();

  array[0] = date.getFullYear();
  array[1] = date.getMonth() + 1;
  array[2] = date.getDate();

  return array;
}

function dateToJSDate (date) {
  date = datePad(date);

  var jsDate = new Date();
  jsDate.setDate(date.day);
  jsDate.setMonth(date.month - 1);
  jsDate.setFullYear(date.year);

  return jsDate;
}

function jsDateToDate (jsDate) {
  var date = {};

  date.year = jsDate.getFullYear();
  date.month = jsDate.getMonth() + 1;
  date.day = jsDate.getDate();

  return date;
}

function dateObjectValid (obj) {
  if ('object' !== typeof obj) {
    return false;
  }

  var yearValid = obj.year && obj.year > 0;
  var monthValid = obj.month && obj.month > 0 && obj.month < 13;
  var dayValid = obj.day && obj.day > 0 && obj.day < 32;

  return yearValid || monthValid || dayValid;
}

function arrayToDateObject (array) {
  var obj = {};

  if (array[0] && array[0] >= 0) {
    obj.year = parseInt(array[0], 10);
  }
  if (array[1] && 1 <= array[1] && array[1] <= 12) {
    obj.month = parseInt(array[1], 10);
  }
  if (array[2] && 1 <= array[2] && array[2] <= 31) {
    obj.day = parseInt(array[2], 10);
  }

  return obj;
}

/**
 * Default values
 */
function defaultYear () {
  var date = new Date();
  return date.getFullYear();
}
function defaultMonth () {
  var date = new Date();
  return date.getMonth() + 1;
}
function defaultDay () {
  var date = new Date();
  return date.getDate();
}

/**
 * Schema
 */
var schema = new mongoose.Schema({
  date: {
    year: {
      default: defaultYear,
      index: true,
      min: 0,
      required: true,
      type: Number
    },
    month: {
      default: defaultMonth,
      index: true,
      max: 12,
      min: 1,
      required: true,
      type: Number
    },
    day: {
      default: defaultDay,
      index: true,
      max: 31,
      min: 1,
      required: true,
      type: Number
    }
  },
  color: {
    default: 'blue',
    enum: ['blue', 'white', 'red'],
    required: true,
    type: String
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
    var year = pad(this.date.year, 4);
    var month = pad(this.date.month, 2);
    var day = pad(this.date.day, 2);

    return ''+ year + '-' + month + '-' + day;
  },

  setDate: function(data) {
    var date = Tempo.parseDate(data);

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

  date = Tempo.parseDate(date);

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

  date = Tempo.parseDate(date);

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

function getDaysBetweenDates(startDate, endDate) {
  var jsStartDate = dateToJSDate(startDate);
  var jsEndDate = dateToJSDate(endDate);

  var diff = jsEndDate.getTime() - jsStartDate.getTime();

  var oneDay = 1000 * 60 * 60 * 24;

  return Math.ceil(diff / oneDay);
}

function getDatesBetweenDates(startDate, endDate) {
  var dates = Array();
  var diff = getDaysBetweenDates(startDate, endDate);

  var jsDate = dateToJSDate(datePad(startDate));

  for (var i = 0; i < diff; i++) {
    dates.push(jsDateToDate(jsDate));
    jsDate.setDate(jsDate.getDate() + 1);
  }

  return dates;
}

schema.static('findByDateRange', function (startDate, endDate, callback) {
  if (!startDate || !endDate || !callback) {
    throw new Error('Invalid parameters');
  }

  startDate = Tempo.parseDate(startDate);
  endDate = Tempo.parseDate(endDate);

  var condition = Array();
  var dates = getDatesBetweenDates(startDate, endDate);
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
  if (dateObjectValid(data)) {
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
    dateArray = jsDateToArray(data);
  }
  else {
    throw Error('invalid arguments');
  }

  var date = arrayToDateObject(dateArray);

  if (!dateObjectValid(date)) {
    throw Error('invalid arguments');
  }

  return date;
});


/**
 * Model
 */
var Tempo = mongoose.model('Tempo', schema);
module.exports = Tempo;