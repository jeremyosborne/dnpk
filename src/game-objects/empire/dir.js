import * as configGameObjects from 'config-game-objects'

/**
 * List of `name`s of loaded empires.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => configGameObjects.dir('empire')

export default dir
