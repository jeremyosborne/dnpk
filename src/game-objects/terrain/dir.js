import * as configGameObjects from 'config-game-objects'

/**
 * List of `name`s of loaded terrain.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => configGameObjects.dir('terrain')

export default dir
