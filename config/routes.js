
/*!
 * Module dependencies.
 */

var slashes = require("connect-slashes");

/**
 * Controllers
 */

var tempo    = require('../app/controllers/tempo')
  , ejp      = require('../app/controllers/ejp')
  , forecast = require('../app/controllers/forecast')
  , cron     = require('../app/controllers/cron')
  , content  = require('../app/controllers/index')
  , auth     = require('./middlewares/authorization');

/**
 * Route middlewares
 */
var secureAccess = [auth.hasApiKey];

/**
 * Expose routes
 */

module.exports = function (app) {

  // Parameters
  app.param('year', Number);
  app.param('month', Number);
  app.param('day', Number);

  // Front
  app.get('/', slashes(), content.index);
  // Robots.txt
  app.get('/robots.txt', content.robotstxt);

  // Tempo
  app.post('/tempo', secureAccess, tempo.create);
  app.post('/tempo/:year-:month-:day', secureAccess, tempo.create);

  app.del('/tempo/:year-:month-:day', secureAccess, tempo.del);

  app.get('/tempo', tempo.listAll);
  app.get('/tempo/:year', tempo.listDates);
  app.get('/tempo/:year-:month', tempo.listDates);
  app.get('/tempo/:year-:month-:day', tempo.listDates);

  app.get('/tempo/count', tempo.count);
  app.get('/tempo/count/:year-:month-:day', tempo.count);

  // Ejp
  app.post('/ejp', secureAccess, ejp.create);
  app.post('/ejp/:year-:month-:day', secureAccess, ejp.create);

  app.del('/ejp/:year-:month-:day', secureAccess, ejp.del);

  app.get('/ejp', ejp.listAll);
  app.get('/ejp/:year', ejp.listDates);
  app.get('/ejp/:year-:month', ejp.listDates);
  app.get('/ejp/:year-:month-:day', ejp.listDates);

  app.get('/ejp/count', ejp.count);
  app.get('/ejp/count/:year-:month-:day', ejp.count);

  // Forecast
  app.get('/forecast', forecast.index);
  app.get('/forecast-with-counters', forecast.indexWithCounters);

  // Cron
  app.get('/cron', cron.cron);

}
