var path     = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , tempo    = { start: { month: 9, day: 1 } }
  , ejp      = { start: { month: 9, day: 1 } }
  , apikey   = 'APIKEY';

module.exports = {
  development: {
    db: 'mongodb://localhost:27017/tempo',
    root: rootPath,
    app: {
      name: 'Tempo API DEV'
    },
    tempo: tempo,
    ejp: ejp,
    apikey: apikey,
    cron: 'echo hello'
  },
  test: {
    db: 'mongodb://localhost:27017/Tempo-API',
    root: rootPath,
    app: {
      name: 'echo hello'
    },
    tempo: tempo,
    ejp: ejp,
    apikey: apikey,
    cron: 'echo hello'
  },
  production: {}
}
