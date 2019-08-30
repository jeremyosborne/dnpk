import * as configGameObjects from 'config-game-objects'
import dir from './dir'
import _ from 'lodash'
import uuid from 'uuid/v1'

/**
 * Return a new army instance.
 *
 * @param {string} name of the army to create.
 *
 * @return {object} new army instance.
 */
export const create = ({name}) => {
  const army = configGameObjects.create({name, type: 'army'})

  // All objects get a unique id.
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

/**
 * Create a random army picked from the currently available list of valid armies.
 *
 * @return {object} new army instance.
 *
 * @throw {Error} if there appear to be no armies loaded.
 */
create.random = () => {
  const name = _.sample(dir())
  if (!name) {
    throw new Error('army.create.random: no army names available. Did you load the armies before calling this method?')
  }

  return create({name})
}
