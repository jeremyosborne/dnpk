import * as dataSourceGameObjects from 'data-source-game-objects'

/**
 * List of `name`s of loaded equippables.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => dataSourceGameObjects.dir('equippable')

export default dir
