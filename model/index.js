var Forecast = require('./forecast')
    Tempo    = require('./tempo');

module.exports = {
  Forecast: Forecast.model,
  Tempo: Tempo.model
};