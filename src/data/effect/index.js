const debug = require('debug')
const path = require('path')
const typeFactoryFactory = require('../type-factory-factory')

// Public API.
module.exports = typeFactoryFactory({
  DEFS_DIR: path.resolve(path.join(__dirname, 'defs')),
  logger: debug('dnpk/data/effect'),
  SCHEMA_ID: 'https://jeremyosborne.com/dnpk/effect.schema.json',
})
