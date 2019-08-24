const debug = require('debug')
const effect = require('data/effect')
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
    // instantiate effects
    (equippable) => {
      // This works on create and allows us to shorthand effect defs in the
      // base army defs and fill in the normal information later.
      // If base def wants to supply more meaningful data, that data will be
      // preserved as default.
      equippable.effects = _.map(equippable.effects, (o) => _.merge(effect.create(o.name), o))
      return equippable
    },
  ]),
  SCHEMA: require('./schema.json'),
})
