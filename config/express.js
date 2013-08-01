
/**
 * Module dependencies.
 */

var express = require('express')
  , params = require('express-params');

module.exports = function (app, config) {

  app.set('showStackError', true);

  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
    },
    level: 9
  }));

  app.use(express.favicon());
  app.use(express.static(config.root + '/public'));

  // don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'));
  }

  // set views path, template engine and default layout
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  // express params.
  params.extend(app);

  app.configure(function () {
    // Json and urlencoded should be above methodOverride
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());

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
      res.status(500).render('500', { error: err.stack });
    })

    // assume 404 since no middleware responded
    app.use(function(req, res, next) {
      res.status(404).json({
        error : 'Not found',
        code: 404,
        url: req.originalUrl,
      });
    });
  })

  // development env config
  app.configure('development', function () {
    app.use(express.errorHandler());
    app.locals.pretty = true;
  })
}
