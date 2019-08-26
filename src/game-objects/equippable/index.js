const configGameObjects = require('config-game-objects')
const _ = require('lodash')
const uuid = require('uuid/v1')

// Public API.
module.exports = {
  dir: () => configGameObjects.dir('equippable'),

  create: ({name}) => {
    const equippable = configGameObjects.create({name, type: 'equippable'})
    equippable.id = uuid()
    // Instantiate effects, if any.
    equippable.effects = _.map(equippable.effects, (eff) => {
      return _.merge(configGameObjects.create({name: eff.name, type: 'effect'}), eff)
    })
    // no reason to have this in game
    delete equippable.documentation

    return equippable
  }
}
