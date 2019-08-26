const configGameObjects = require('config-game-objects')
const _ = require('lodash')
const uuid = require('uuid/v1')

// Public API.
module.exports = {
  dir: () => configGameObjects.dir('army'),

  create: ({name}) => {
    const army = configGameObjects.create({name, type: 'army'})
    army.id = uuid()
    // Instantiate effects, if any.
    army.effects = _.map(army.effects, (eff) => {
      return _.merge(configGameObjects.create({name: eff.name, type: 'effect'}), eff)
    })
    // instantiate equippables (should be rare to non-existent in most game play)
    army.equipment = _.map(army.equipment, (eq) => {
      return _.merge(configGameObjects.create({name: eq.name, type: 'equippable'}), eq)
    })

    return army
  }
}
