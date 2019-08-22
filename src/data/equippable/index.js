const debug = require('debug')
const _ = require('lodash')
const path = require('path')
const typeFactoryFactory = require('../type-factory-factory')

// Public API.
module.exports = typeFactoryFactory({
  DEFS_DIR: path.resolve(path.join(__dirname, 'defs')),
  logger: debug('dnpk/data/equippable'),
  postCreate: _.flow([
    // delete documentation field
    (equippable) => {
      delete equippable.documentation
      return equippable
    },
  ]),
  SCHEMA_ID: 'https://jeremyosborne.com/dnpk/equippable.schema.json',
})
