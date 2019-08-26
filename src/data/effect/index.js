const configGameObjects = require('config-game-objects')
const uuid = require('uuid/v1')

// Public API.
module.exports = {
  dir: () => configGameObjects.dir('effect'),

  create: ({name}) => {
    const effect = configGameObjects.create({name, type: 'effect'})
    effect.id = uuid()
    // Remove documentation.
    delete effect.documentation

    return effect
  }
}
