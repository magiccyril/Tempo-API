
/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var tempo    = require('../app/controllers/tempo')
  , ejp      = require('../app/controllers/ejp')
  , forecast = require('../app/controllers/forecast')
  , content  = require('../app/controllers/index');

/**
 * Expose routes
 */

module.exports = function (app) {

  // Parameters
  app.param('year', Number);
  app.param('month', Number);
  app.param('day', Number);

  // Front
  app.get('/', content.index);

  // Tempo
  app.post('/tempo', tempo.create);
  app.post('/tempo/:year-:month-:day', tempo.create);

  app.del('/tempo/:year-:month-:day', tempo.del);

  app.get('/tempo', tempo.listAll);
  app.get('/tempo/:year', tempo.listDates);
  app.get('/tempo/:year-:month', tempo.listDates);
  app.get('/tempo/:year-:month-:day', tempo.listDates);

  app.get('/tempo/count', tempo.count);
  app.get('/tempo/count/:year-:month-:day', tempo.count);

  // Ejp
  app.post('/ejp', ejp.create);
  app.post('/ejp/:year-:month-:day', ejp.create);

  app.del('/ejp/:year-:month-:day', ejp.del);

  app.get('/ejp', ejp.listAll);
  app.get('/ejp/:year', ejp.listDates);
  app.get('/ejp/:year-:month', ejp.listDates);
  app.get('/ejp/:year-:month-:day', ejp.listDates);

  app.get('/ejp/count', ejp.count);
  app.get('/ejp/count/:year-:month-:day', ejp.count);

  // Forecast
  app.get('/forecast', forecast.index);
  app.get('/forecast-with-counters', forecast.indexWithCounters);
}
