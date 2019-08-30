import * as configGameObjects from 'config-game-objects'

/**
 * List of `name`s of loaded effects.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => configGameObjects.dir('effect')

export default dir
