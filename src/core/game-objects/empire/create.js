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
  const entity = dataSourceModdables.create({name, type: 'empire'})

  // Not planning on using documentation in game... for now.
  delete entity.documentation

  // Instantiate effects, if any.
  entity.cosmetics = _.map(entity.cosmetics, (cosmetic) => {
    return _.merge(dataSourceModdables.create({name: cosmetic.name, type: 'cosmetic'}), cosmetic)
  })

  // All objects get a unique id.
  entity.id = uuid()

  return entity
}

export default create
