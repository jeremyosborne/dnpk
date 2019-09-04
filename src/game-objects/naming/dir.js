import * as configGameObjects from 'config-game-objects'

/**
 * List of the types of name groups available.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => configGameObjects.dir('naming')

export default dir
