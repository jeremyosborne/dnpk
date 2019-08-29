import * as configGameObjects from 'config-game-objects'
import uuid from 'uuid/v1'

// Public API.
export default {
  dir: () => configGameObjects.dir('effect'),

  create: ({name}) => {
    const effect = configGameObjects.create({name, type: 'effect'})
    effect.id = uuid()
    // Remove documentation.
    delete effect.documentation

    return effect
  }
}
