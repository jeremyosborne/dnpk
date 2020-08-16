import {create as cosmeticCreate} from '../cosmetic'
import * as dataSourceModdables from 'data-source-moddables'
import {create as effectCreate} from '../effect'
import {create as equippableCreate} from '../equippable'
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
  const entity = dataSourceModdables.create({name, type: 'army'})

  // Instantiate cosmetics, if any.
  entity.cosmetics = _.map(entity.cosmetics, (cosmetic) => {
    return _.merge(cosmeticCreate({name: cosmetic.name}), cosmetic)
  })

  // Instantiate effects, if any.
  entity.effects = _.map(entity.effects, (eff) => {
    return _.merge(effectCreate({name: eff.name}), eff)
  })

  // Instantiate equippables, if any.
  entity.equipment = _.map(entity.equipment, (eq) => {
    return _.merge(equippableCreate({name: eq.name}), eq)
  })

  // All objects get a unique id.
  entity.id = uuid()

  entity.metadata.createdAt = new Date().toISOString()

  return entity
}

export default create
