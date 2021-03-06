import * as dataSourceModdables from 'data-source-moddables'
import {create as effectCreate} from '../effect'
import _ from 'lodash'
import {v1 as uuid} from 'uuid'

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
    return _.merge(effectCreate({name: eff.name}), eff)
  })

  // no reason to have this in game
  delete entity.documentation

  entity.metadata.createdAt = new Date().toISOString()

  return entity
}

export default create
