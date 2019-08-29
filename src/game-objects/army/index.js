import * as configGameObjects from 'config-game-objects'
import _ from 'lodash'
import uuid from 'uuid/v1'

/**
 * List of `name`s of loaded armies.
 *
 * @return {string[]} List of unique army names.
 */
export const dir = () => configGameObjects.dir('army')

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
