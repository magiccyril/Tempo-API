
/**
 * Module dependencies.
 */

var express = require('express')
  , params  = require('express-params')
  , routes  = require('./routes')
  , tempo   = require('./routes/tempo')
  , ejp     = require('./routes/ejp')
  , http    = require('http')
  , path    = require('path')
  , config  = require('./config');

var app = express();
params.extend(app);

// connect to Mongo when the app initializes
if (0 === mongoose.connection.readyState) {
  mongoose.connect(config.getConnectionString());
}

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Parameters
app.param('year', Number);
app.param('month', Number);
app.param('day', Number);

// Front
app.get('/', routes.index);

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

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

module.exports = app;
