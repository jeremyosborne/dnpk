import * as dataSourceGameObjects from 'data-source-game-objects'
import _ from 'lodash'
import uuid from 'uuid/v1'

/**
 * Return a new effect instance.
 *
 * @param {string} name of the army to create.
 *
 * @return {object} new army instance.
 */
export const create = ({name}) => {
  const equippable = dataSourceGameObjects.create({name, type: 'equippable'})
  equippable.id = uuid()
  // Instantiate effects, if any.
  equippable.effects = _.map(equippable.effects, (eff) => {
    return _.merge(dataSourceGameObjects.create({name: eff.name, type: 'effect'}), eff)
  })
  // no reason to have this in game
  delete equippable.documentation

  return equippable
}

export default create
