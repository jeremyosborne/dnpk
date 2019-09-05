import * as configGameObjects from 'config-game-objects'

/**
 * List of all of the `names` of available rule sets.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => configGameObjects.dir('rules')

export default dir
