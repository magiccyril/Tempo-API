
/**
 * Module dependencies.
 */

var express = require('express')
  , params  = require('express-params')
  , utils   = require('../lib/utils')
  , env     = process.env.NODE_ENV || 'development';

module.exports = function (app, config) {

  app.set('showStackError', true);

  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
    },
    level: 9
  }));

  app.enable('trust proxy');

  app.use(express.favicon());
  app.use(express.static(config.root + '/public'));

  // logger
  express.logger.token('nicedate', function(req, res) {
    var now = new Date();
    var year   = now.getFullYear();
    var month  = utils.rightPad(now.getMonth() + 1, 2, '0');
    var day    = utils.rightPad(now.getDate(), 2, '0');
    var hour   = utils.rightPad(now.getHours(), 2, '0');
    var minute = utils.rightPad(now.getMinutes(), 2, '0');
    var second = utils.rightPad(now.getSeconds(), 2, '0');

    return '' + year + '/' + month + '/' + day + '-' + hour + ':' + minute + ':' + second;
  });

  switch (env) {
    // don't use logger for test env
    case 'test':
      break;

    case 'development':
      app.use(express.logger('dev'));
      break;

    default:
      app.use(express.logger(':remote-addr :nicedate - :method :url [:status / :response-time ms] (referrer: :referrer)'));
      break;
  }

  // set views path, template engine and default layout
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  // express params
  params.extend(app);

  app.configure(function () {
    // Json and urlencoded should be above methodOverride
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());

    // allow CORS
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');

      next();
    });

    // routes should be at the last
    app.use(app.router);

    // assume "not found" in the error msgs is a 404.
    // this is somewhat silly, but valid, you can do whatever you like,
    // set properties, use instanceof etc.
    app.use(function(err, req, res, next){
      // treat as 404
      if (err.message
        && (~err.message.indexOf('not found')
        || (~err.message.indexOf('Cast to ObjectId failed')))) {
        return next();
      }

      // log it
      console.error(err.stack);

      // error page
      res.status(500).json({ error: err.stack });
    });

    // assume 404 since no middleware responded
    app.use(function(req, res, next) {
      res.status(404).json({
        error : 'Not found',
        code: 404,
        url: req.originalUrl,
      });
    });
  });

  // development env config
  app.configure('development', function () {
    app.use(express.errorHandler());
    app.locals.pretty = true;
  });
}
