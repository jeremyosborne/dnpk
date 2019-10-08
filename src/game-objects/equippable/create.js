import * as dataSourceGameObjects from 'data-source-game-objects'
import dir from './dir'
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

/**
 * Create a random equippable picked from the currently available list of valid equppables.
 *
 * @return {object} new equippable instance.
 *
 * @throw {Error} if there appear to be no equippables loaded.
 */
create.random = () => {
  const name = _.sample(dir())
  if (!name) {
    throw new Error('equippable.create.random: no equippable names available. Did you load the equippables before calling this method?')
  }

  return create({name})
}
