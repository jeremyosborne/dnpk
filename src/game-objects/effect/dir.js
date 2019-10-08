import * as dataSourceGameObjects from 'data-source-game-objects'

/**
 * List of `name`s of loaded effects.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => dataSourceGameObjects.dir('effect')

export default dir
