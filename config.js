var path = require('path'),
    nconf = require('nconf')
    mongoose = require('mongoose');

var config = new nconf.Provider({
  env: true,
  argv: true,
  store: {
    type: 'file',
    file: path.join(__dirname, 'config.parameters.json')
  }
});

config.getConnectionString = function(suffix) {
  var connectionString = 'mongodb://'+ config.get('database:host') +':'+ config.get('database:port') +'/'+ config.get('database:name');

  if (suffix) {
    connectionString += suffix;
  }

  return connectionString;
}

module.exports = config;