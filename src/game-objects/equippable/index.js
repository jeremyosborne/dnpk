import * as configGameObjects from 'config-game-objects'
import _ from 'lodash'
import uuid from 'uuid/v1'

/**
 * List of `name`s of loaded equippables.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => configGameObjects.dir('equippable')

/**
 * Return a new effect instance.
 *
 * @param {string} name of the army to create.
 *
 * @return {object} new army instance.
 */
export const create = ({name}) => {
  const equippable = configGameObjects.create({name, type: 'equippable'})
  equippable.id = uuid()
  // Instantiate effects, if any.
  equippable.effects = _.map(equippable.effects, (eff) => {
    return _.merge(configGameObjects.create({name: eff.name, type: 'effect'}), eff)
  })
  // no reason to have this in game
  delete equippable.documentation

  return equippable
}
