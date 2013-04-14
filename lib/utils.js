/**
 * Return default year
 * @return {integer}
 */
exports.defaultYear = function () {
  var date = new Date();
  return date.getFullYear();
}

/**
 * Return default month
 * @return {integer}
 */
exports.defaultMonth = function () {
  var date = new Date();
  return date.getMonth() + 1;
}

/**
 * Return default day
 * @return {integer}
 */
exports.defaultDay = function () {
  var date = new Date();
  return date.getDate();
}

/**
 * Pad an array to a certain size with value
 *
 * @param  {integer} padSize  Final length of the Array
 * @param  {mixed}   padValue The value to pad in the Array
 * @return {Array}            Array padded to a certain padSize with padValue
 */
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
 * Pad a string number to a certain string length
 *
 * @param  {string}  str      string number to pad
 * @param  {integer} padSize  final length of the string
 * @param  {string}  padValue the value to pad in the string
 * @return {string}
 */
exports.rightPad = function (str, padSize, padValue) {
  var str = '' + str;
  while (str.length < padSize) {
    str = '' + padValue + str;
  }

  return str;
}

/**
 * Pad a date object with default values
 *
 * @param  {object} date
 * @return {object}
 */
exports.datePad = function (date) {
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
 * Determine if a date object is valid
 *
 * @param  {object}  obj A date object
 * @return {boolean}     true if date is valid, false otherwise
 */
exports.dateObjectValid = function (obj) {
  if ('object' !== typeof obj) {
    return false;
  }

  var yearValid = obj.year && obj.year > 0;
  var monthValid = obj.month && obj.month > 0 && obj.month < 13;
  var dayValid = obj.day && obj.day > 0 && obj.day < 32;

  return yearValid || monthValid || dayValid;
}

/**
 * Convert a Javascript Date Object to an Array
 *
 * @param  {[type]} date Javascript Date object to convert
 * @return {Array}       Array[Year, Month, Day]
 */
exports.jsDateToArray = function (date) {
  var array = Array();

  array[0] = date.getFullYear();
  array[1] = date.getMonth() + 1;
  array[2] = date.getDate();

  return array;
}

/**
 * Convert a date object to a Javascript Date object
 *
 * @param  {object} date date object
 * @return {Date}        Javascript Date object
 */
exports.dateToJSDate = function (date) {
  date = this.datePad(date);

  var jsDate = new Date();
  jsDate.setDate(date.day);
  jsDate.setMonth(date.month - 1);
  jsDate.setFullYear(date.year);

  return jsDate;
}

/**
 * Convert a Javascript Date Object to a date object
 *
 * @param  {Date}   jsDate Javascript Date object
 * @return {object}        date object
 */
exports.jsDateToDate = function (jsDate) {
  var date = {};

  date.year = jsDate.getFullYear();
  date.month = jsDate.getMonth() + 1;
  date.day = jsDate.getDate();

  return date;
}

/**
 * Convert an array to a date object
 *
 * @param  {Array}  array the date array to convert
 * @return {object}       date object
 */
exports.arrayToDateObject = function (array) {
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
 * Convert year, month and day parameters to a string
 *
 * @param  {int}    year
 * @param  {int}    month
 * @param  {int}    day
 * @return {string}       year-month-day
 */
exports.yearMonthDayToString = function (year, month, day) {
  var date = '';
  if (year) {
    date += this.rightPad(year, 4, '0');
  }
  if (month) {
    date += '-' + this.rightPad(month, 2, '0');
  }
  if (day) {
    date += '-' + this.rightPad(day, 2, '0');
  }

  return date;
}

/**
 * Get number of days between two dates object
 *
 * @param  {object}  startDate Start date object
 * @param  {object}  endDate   End date object
 * @return {integer}           Number of days between startDate and endDate
 */
exports.getDaysBetweenDates = function(startDate, endDate) {
  var jsStartDate = this.dateToJSDate(startDate);
  var jsEndDate = this.dateToJSDate(endDate);

  var diff = jsEndDate.getTime() - jsStartDate.getTime();

  var oneDay = 1000 * 60 * 60 * 24;

  return Math.ceil(diff / oneDay);
}

/**
 * Get an Array of dates between two dates
 *
 * @param  {object}  startDate Start date object
 * @param  {object}  endDate   End date object
 * @return {Array}             Array of dates between startDate and endDate
 */
exports.getDatesBetweenDates = function(startDate, endDate) {
  var dates = Array();
  var diff = this.getDaysBetweenDates(startDate, endDate);

  var jsDate = this.dateToJSDate(this.datePad(startDate));

  for (var i = 0; i < diff; i++) {
    dates.push(this.jsDateToDate(jsDate));
    jsDate.setDate(jsDate.getDate() + 1);
  }

  return dates;
}

/**
 * Get a random boolean
 *
 * @return {boolean}
 */
exports.getRandomBoolean = function() {
  var i = Math.floor(Math.random() * 2);
  switch (i) {
    case 0:
      return false;
    case 1:
      return true;
  }
}

/**
 * Get a random tempo color
 * @return {string} blue/white/red
 */
exports.getRandomColor = function() {
  var i = Math.floor(Math.random() * 3);
  switch (i) {
    case 0:
      return 'blue';
    case 1:
      return 'white';
    case 2:
      return 'red';
  }
}