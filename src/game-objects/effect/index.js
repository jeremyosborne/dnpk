import * as configGameObjects from 'config-game-objects'
import uuid from 'uuid/v1'

/**
 * List of `name`s of loaded effects.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => configGameObjects.dir('effect')

/**
 * Return a new effect instance.
 *
 * @param {string} name of the army to create.
 *
 * @return {object} new army instance.
 */
export const create = ({name}) => {
  const effect = configGameObjects.create({name, type: 'effect'})

  // All objects get a unique id.
  effect.id = uuid()

  // Not planning on using documentation in game... for now.
  delete effect.documentation

  return effect
}
