import * as dataSourceGameObjects from 'data-source-game-objects'

/**
 * List of `name`s of loaded terrain.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => dataSourceGameObjects.dir('terrain')

export default dir
