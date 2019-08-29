import * as configGameObjects from 'config-game-objects'
import _ from 'lodash'
import uuid from 'uuid/v1'

// Public API.
export default {
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
