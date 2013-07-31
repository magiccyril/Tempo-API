
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async    = require('async')
  , Tempo    = mongoose.model('Tempo')
  , Ejp      = mongoose.model('Ejp')
  , utils    = require('../../lib/utils');

/**
 * Create funciton to fetch today and tomorrow dates
 * @param  {object}   Model Model object to query
 * @return {function}
 */
function fetchTodayAndTomorrowDatesFactory(Model) {
  return function(callback) {
    Model.getTodayAndTomorrow(callback);
  }
}

/**
 * Fetch today and tomorrow dates for tempo and ejp
 * @param  {Function} callback
 */
function fetchTodayAndTomorrowDates(callback) {
  var getDatesTasks = {
    tempo: fetchTodayAndTomorrowDatesFactory(Tempo),
    ejp:   fetchTodayAndTomorrowDatesFactory(Ejp)
  };

  async.parallel(getDatesTasks, callback);
}

/**
 * Create function to fetch data of @Model at @date
 * @param  {object}   Model object to query
 * @param  {object}   JS date
 * @return {function}
 */
function fetchValueFactory(Model, date) {
  return function(callback) {
    Model.findOneByDate(date, callback);
  }
}

/**
 * Create function to fetch counter of @Model
 * @param  {object}   Model object to query
 * @return {function}
 */
function fetchCountFactory(Model) {
  return function(callback) {
    Model.getStartDate(function(err, from) {
      Model.findByDateRange(from, new Date(), function(err, data) {
        if (err) {
          callback(err, null);
        }

        Model.count(data, callback);
      });
    });
  }
}

/**
 * Build results of fetchData
 * @param  {Function} callback
 * @param  {[type]}   withCounters
 * @return {Function}
 */
function buildDataFactory(callback, withCounters) {
  return function(err, datas) {
    if (err) {
      return callback(err, null);
    }

    var results = {
      'today': {
        'tempo': datas.todayTempo,
        'ejp': datas.todayEjp
      },
      'tomorrow': {
        'tempo': datas.tomorrowTempo,
        'ejp': datas.tomorrowEjp
      }
    };

    if (withCounters) {
      results.count = {
        'tempo': {
          'blue': datas.countTempo.blue,
          'white': datas.countTempo.white,
          'red': datas.countTempo.red
        },
        'ejp': {
          'north': datas.countEjp.north,
          'paca': datas.countEjp.paca,
          'west': datas.countEjp.west,
          'south': datas.countEjp.south
        }
      };
    }

    callback(err, results);
  }
}

/**
 * Fetch all data
 * @param  {Function} callback
 * @param  {String}   withCounters if is set add counters infos
 */
function fetchData(callback, withCounters) {
  if (undefined === withCounters) {
    withCounters = false;
  }
  else {
    withCounters = true;
  }

  fetchTodayAndTomorrowDates(function(err, dates) {
    if (err) {
      return callback(err, null);
    }

    var parallelTasks = {};

    if (withCounters) {
      parallelTasks.countTempo = fetchCountFactory(Tempo);
      parallelTasks.countEjp   = fetchCountFactory(Ejp);
    }

    parallelTasks.todayTempo    = fetchValueFactory(Tempo, dates.tempo.today);
    parallelTasks.tomorrowTempo = fetchValueFactory(Tempo, dates.tempo.tomorrow);
    parallelTasks.todayEjp      = fetchValueFactory(Ejp, dates.ejp.today);
    parallelTasks.tomorrowEjp   = fetchValueFactory(Ejp, dates.ejp.tomorrow);

    async.parallel(parallelTasks, buildDataFactory(callback, withCounters));
  });
}

/**
 * Index page, with tempo and ejp data for today and tomorrow.
 */
exports.index = function(req, res) {
  fetchData(function(err, results) {
    if (err) {
      return res.send(501);
    }

    res.json(results);
  });
};

/*
 * Index page, with tempo and ejp data for today and tomorrow + counters.
 */
exports.indexWithCounters = function(req, res) {
  fetchData(function(err, results) {
    if (err) {
      return res.send(501);
    }

    res.json(results);
  }, 'withCounters');
};