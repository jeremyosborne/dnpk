import * as dataSourceGameObjects from 'data-source-game-objects'

/**
 * List of all of the `names` of available rule sets.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => dataSourceGameObjects.dir('rules')

export default dir
