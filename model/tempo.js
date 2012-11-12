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

/**
 * Date conversion tools
 */
function dateStringToArray (string) {
  var array = string.split('-');
  return array.pad(3, false);
}

function dateToArray (date) {
  var array = Array();

  array[0] = date.getFullYear();
  array[1] = date.getMonth() + 1;
  array[2] = date.getDate();

  return array;
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

  var condition = getFindByDateCondition(date);
  return this.findOne(condition, callback);
});

schema.static('findByDate', function () {
  if (2 > arguments.length && arguments.length > 3) {
    throw new Error('Invalid parameters');
  }

  var callback = arguments[arguments.length - 1];
  var condition = null;

  switch (arguments.length) {
    case 2:
      condition = getFindByDateCondition(arguments[0]);
      break;
    case 3:
      condition = getFindByDateRangeCondition(arguments[0], arguments[1]);
      break;
    default:
      throw new Error('Invalid parameters');
  }

  return this.find(condition, callback);
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
    dateArray = dateToArray(data);
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


function getFindByDateCondition(date) {
  var condition = {};
  date = Tempo.parseDate(date);

  if (date.year) {
    condition['date.year'] = date.year;
  }
  if (date.month) {
    condition['date.month'] = date.month;
  }
  if (date.day) {
    condition['date.day'] = date.day;
  }

  return condition;
}
function getFindByDateRangeCondition(dateStart, dateEnd) {
  var condition = {};
  dateStart = Tempo.parseDate(dateStart);
  dateEnd = Tempo.parseDate(dateEnd);

  if (dateStart.year && dateEnd.year) {
    condition['date.year'] = {
      '$gte': dateStart.year,
      '$lte': dateEnd.year
    };
  }
  if (dateStart.month && dateEnd.month) {
    condition['date.month'] = {
      '$gte': dateStart.month,
      '$lte': dateEnd.month
    };
  }
  if (dateStart.day && dateEnd.day) {
    condition['date.day'] = {
      '$gte': dateStart.day,
      '$lte': dateEnd.day
    };
  }

  return condition;
}


/**
 * Model
 */
var Tempo = mongoose.model('Tempo', schema);
module.exports = Tempo;