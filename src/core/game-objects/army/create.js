import * as dataSourceModdables from 'data-source-moddables'
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
  const army = dataSourceModdables.create({name, type: 'army'})

  // All objects get a unique id.
  army.id = uuid()

  // Instantiate effects, if any.
  army.effects = _.map(army.effects, (eff) => {
    return _.merge(dataSourceModdables.create({name: eff.name, type: 'effect'}), eff)
  })

  // instantiate equippables (should be rare to non-existent in most game play)
  army.equipment = _.map(army.equipment, (eq) => {
    // The following line is not testable until we DI the dataSourceModdables.
    return _.merge(dataSourceModdables.create({name: eq.name, type: 'equippable'}), eq)
  })

  return army
}

export default create
