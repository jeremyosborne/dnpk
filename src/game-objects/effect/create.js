import * as dataSourceModdables from 'data-source-moddables'
import uuid from 'uuid/v1'

/**
 * Return a new effect instance.
 *
 * @param {string} name of the army to create.
 *
 * @return {object} new army instance.
 */
export const create = ({name}) => {
  const effect = dataSourceModdables.create({name, type: 'effect'})

  // All objects get a unique id.
  effect.id = uuid()

  // Not planning on using documentation in game... for now.
  delete effect.documentation

  return effect
}

export default create
