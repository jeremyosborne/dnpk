import * as dataSourceGameObjects from 'data-source-game-objects'
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
  const army = dataSourceGameObjects.create({name, type: 'army'})

  // All objects get a unique id.
  army.id = uuid()

  // Instantiate effects, if any.
  army.effects = _.map(army.effects, (eff) => {
    return _.merge(dataSourceGameObjects.create({name: eff.name, type: 'effect'}), eff)
  })

  // instantiate equippables (should be rare to non-existent in most game play)
  army.equipment = _.map(army.equipment, (eq) => {
    // The following line is not testable until we DI the dataSourceGameObjects.
    return _.merge(dataSourceGameObjects.create({name: eq.name, type: 'equippable'}), eq)
  })

  return army
}

export default create
