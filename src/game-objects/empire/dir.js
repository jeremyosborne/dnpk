import * as dataSourceGameObjects from 'data-source-game-objects'

/**
 * List of `name`s of loaded empires.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => dataSourceGameObjects.dir('empire')

export default dir
