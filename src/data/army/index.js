const effect = require('data/effect')
const equippable = require('data/equippable')
const debug = require('debug')
const _ = require('lodash')
const path = require('path')
const typeFactoryFactory = require('../type-factory-factory')

// Public API.
module.exports = typeFactoryFactory({
  DEFS_DIR: path.resolve(path.join(__dirname, 'defs')),
  logger: debug('dnpk/data/army'),
  postCreate: _.flow([
    // instantiate effects
    (army) => {
      // This works on create and allows us to shorthand effect defs in the
      // base army defs and fill in the normal information later.
      // If base def wants to supply more meaningful data, that data will be
      // preserved as default.
      army.effects = _.map(army.effects, (o) => _.merge(effect.create(o.name), o))
      return army
    },
    // instantiate equippables (should be rare to non-existent in most game play)
    (army) => {
      army.equipment = _.map(army.equipment, (o) => _.merge(equippable.create(o.name), o))
      return army
    },
  ]),
  SCHEMA_ID: 'https://jeremyosborne.com/dnpk/army.schema.json',
})
