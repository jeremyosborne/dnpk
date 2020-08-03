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
  const entity = dataSourceModdables.create({name, type: 'structure'})

  // Instantiate cosmetics, if any.
  entity.cosmetics = _.map(entity.cosmetics, (cosmetic) => {
    return _.merge(dataSourceModdables.create({name: cosmetic.name, type: 'cosmetic'}), cosmetic)
  })

  // Not planning on using documentation in game... for now.
  delete entity.documentation

  // Instantiate effects, if any.
  entity.effects = _.map(entity.effects, (eff) => {
    return _.merge(dataSourceModdables.create({name: eff.name, type: 'effect'}), eff)
  })

  // Instantiate active equippables, if any.
  entity.equipment = _.map(entity.equipment, (eq) => {
    return _.merge(dataSourceModdables.create({name: eq.name, type: 'equippable'}), eq)
  })

  // All objects get a unique id.
  entity.id = uuid()

  // Instantiate equippables in storage, if any.
  entity.storage = _.map(entity.storage, (eq) => {
    return _.merge(dataSourceModdables.create({name: eq.name, type: 'equippable'}), eq)
  })

  return entity
}

export default create
