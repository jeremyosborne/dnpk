import * as dataSourceModdables from 'data-source-moddables'
import _ from 'lodash'
import uuid from 'uuid/v1'

/**
 * Return a new entity instance.
 *
 * @param {string} name of the entity to create.
 *
 * @return {object} new entity instance.
 */
export const create = ({name}) => {
  const entity = dataSourceModdables.create({name, type: 'equippable'})

  // All objects get a unique id.
  entity.id = uuid()

  // Instantiate effects, if any.
  entity.effects = _.map(entity.effects, (eff) => {
    return _.merge(dataSourceModdables.create({name: eff.name, type: 'effect'}), eff)
  })

  // no reason to have this in game
  delete entity.documentation

  return entity
}

export default create
