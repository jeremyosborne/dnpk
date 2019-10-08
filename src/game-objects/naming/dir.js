import * as dataSourceGameObjects from 'data-source-game-objects'

/**
 * List of the types of name groups available.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => dataSourceGameObjects.dir('naming')

export default dir
