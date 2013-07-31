
var path     = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , tempo    = { start: { month: 9, day: 1 } }
  , ejp      = { start: { month: 9, day: 1 } };

module.exports = {
  development: {
    db: 'mongodb://localhost:27017/tempo',
    root: rootPath,
    app: {
      name: 'Tempo API'
    },
    tempo: tempo,
    ejp: ejp
  },
  test: {
    db: 'mongodb://localhost:27017/Tempo-API',
    root: rootPath,
    app: {
      name: 'Tempo API'
    },
    tempo: tempo,
    ejp: ejp
  },
  production: {}
}
