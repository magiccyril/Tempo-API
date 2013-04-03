var Ejp      = require('./ejp')
  , Forecast = require('./forecast')
  , Tempo    = require('./tempo');

module.exports = {
  Ejp: Ejp.model,
  Forecast: Forecast.model,
  Tempo: Tempo.model
};