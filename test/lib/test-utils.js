var assert   = require('assert')
  , should   = require('should')
  , utils    = require('../../lib/utils');

/**
 * Tests
 */
describe('Utils', function() {
  it('should have a function (defaultYear) that respond current year', function(done) {
    var now = new Date();
    var year = utils.defaultYear();

    year.should.equal(now.getFullYear());
    done();
  });

  it('should have a function (defaultMonth) that respond current month', function(done) {
    var now = new Date();
    var month = utils.defaultMonth();

    month.should.equal(now.getMonth() + 1);
    done();
  });

  it('should have a function (defaultDay) that respond current day', function(done) {
    var now = new Date();
    var day = utils.defaultDay();

    day.should.equal(now.getDate());
    done();
  });

  it('Array should have a pad method', function(done) {
    var array = new Array(1, 2, 3).pad(5, 0);

    array.length.should.equal(5);
    array[3].should.equal(0);
    array[4].should.equal(0);

    done();
  });

  it('should have a function (rightPad) to rigth pad a string', function(done) {
    var str = 'aa';
    str = utils.rightPad(str, 4, '0');

    str.length.should.equal(4);
    str[0].should.equal('0');
    str[1].should.equal('0');
    str[2].should.equal('a');
    str[3].should.equal('a');

    done();
  });

  it('should have a function (datePad) to pad a date', function(done) {
    var now = new Date();

    var paddedDate = utils.datePad({
      year: 1985
    });

    should.exist(paddedDate.year);
    should.exist(paddedDate.month);
    should.exist(paddedDate.day);
    paddedDate.year.should.equal(1985);
    paddedDate.month.should.equal(1);
    paddedDate.day.should.equal(1);

    var newPaddedDate = utils.datePad({});

    should.exist(newPaddedDate.year);
    should.exist(newPaddedDate.month);
    should.exist(newPaddedDate.day);
    newPaddedDate.year.should.equal(now.getFullYear());
    newPaddedDate.month.should.equal(1);
    newPaddedDate.day.should.equal(1);

    done();
  });

  it('should have a function (dateObjectValid) to determine if date is valid', function(done) {
    utils.dateObjectValid('1985-01-18').should.be.false;

    utils.dateObjectValid({year: 1985, month: 1, day: 18}).should.be.true;
    utils.dateObjectValid({year: 1985}).should.be.true;
    utils.dateObjectValid({year: 1985, month: 1}).should.be.true;
    utils.dateObjectValid({year: 1985, day: 1}).should.be.true;
    utils.dateObjectValid({month: 1}).should.be.true;
    utils.dateObjectValid({month: 1, day: 18}).should.be.true;
    utils.dateObjectValid({day: 18}).should.be.true;

    utils.dateObjectValid({year: -1}).should.be.false;
    utils.dateObjectValid({month: -1}).should.be.false;
    utils.dateObjectValid({month: 13}).should.be.false;
    utils.dateObjectValid({day: -1}).should.be.false;
    utils.dateObjectValid({day: 32}).should.be.false;

    done();
  });

  it('should have a function (jsDateToArray) to convert a js Date to an array', function(done) {
    var jsDate = new Date();
    jsDate.setFullYear(1985);
    jsDate.setMonth(1 - 1);
    jsDate.setDate(18);

    var arrayDate = utils.jsDateToArray(jsDate);

    arrayDate[0].should.equal(1985);
    arrayDate[1].should.equal(1);
    arrayDate[2].should.equal(18);

    done();
  });

  it('should have a function (dateToJSDate) to convert a date object to a js Date', function(done) {
    var date = { year: 1985, day: 31 };

    var jsDate = utils.dateToJSDate(date);

    jsDate.getFullYear().should.equal(1985);
    jsDate.getMonth().should.equal(1 - 1);
    jsDate.getDate().should.equal(31);

    done();
  });

  it('should have a function (jsDateToDate) to convert a js Date to a date object', function(done) {
    var jsDate = new Date();
    jsDate.setFullYear(1985);
    jsDate.setMonth(1 - 1);
    jsDate.setDate(18);

    var date = utils.jsDateToDate(jsDate);

    date.year.should.equal(1985);
    date.month.should.equal(1);
    date.day.should.equal(18);

    done();
  });

  it('should have a function (arrayToDateObject) to convert an array date to date object', function(done) {
    utils.arrayToDateObject([1985]).year.should.equal(1985);
    utils.arrayToDateObject([1985, 1]).year.should.equal(1985);
    utils.arrayToDateObject([1985, 1]).month.should.equal(1);
    utils.arrayToDateObject([1985, 1, 18]).year.should.equal(1985);
    utils.arrayToDateObject([1985, 1, 18]).month.should.equal(1);
    utils.arrayToDateObject([1985, 1, 18]).day.should.equal(18);

    should.not.exist(utils.arrayToDateObject([]).year);
    should.not.exist(utils.arrayToDateObject([]).month);
    should.not.exist(utils.arrayToDateObject([]).day);

    should.not.exist(utils.arrayToDateObject([1985, -1]).month);
    should.not.exist(utils.arrayToDateObject([1985, 13]).month);

    should.not.exist(utils.arrayToDateObject([1985, 1, -1]).day);
    should.not.exist(utils.arrayToDateObject([1985, 1, 32]).day);

    done();
  });

  it('should have a function (yearMonthDayToString) to convert parameters to a string date', function(done) {
    utils.yearMonthDayToString(1985).should.equal('1985');
    utils.yearMonthDayToString(1985, 1).should.equal('1985-01');
    utils.yearMonthDayToString(1985, 1, 18).should.equal('1985-01-18');

    done();
  });

  it('should have a function (getDaysBetweenDates) to calculate the number of days between two objects dates', function(done) {
    utils.getDaysBetweenDates({ year: 1985, month: 1, day: 1 }, { year: 1985, month: 1, day: 18 }).should.equal(18);
    utils.getDaysBetweenDates({ year: 1985, month: 1, day: 1 }, { year: 1985, month: 12, day: 31 }).should.equal(365);

    done();
  });

  it('should have a function (getDatesBetweenDates) to get all dates between two dates', function(done) {
    var dates = utils.getDatesBetweenDates({ year: 1985, month: 1, day: 1 }, { year: 1985, month: 2, day: 28 });

    dates.length.should.equal(31 + 28);

    dates[0].year.should.equal(1985);
    dates[0].month.should.equal(1);
    dates[0].day.should.equal(1);

    dates[17].year.should.equal(1985);
    dates[17].month.should.equal(1);
    dates[17].day.should.equal(18);

    dates[31 + 1 - 1].year.should.equal(1985);
    dates[31 + 1 - 1].month.should.equal(2);
    dates[31 + 1 - 1].day.should.equal(1);

    dates[31 + 28 - 1].year.should.equal(1985);
    dates[31 + 28 - 1].month.should.equal(2);
    dates[31 + 28 - 1].day.should.equal(28);

    done();
  });
});