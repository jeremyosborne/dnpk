import * as dataSourceModdables from 'data-source-moddables'

/**
 * List of `name`s of loaded equippables.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => dataSourceModdables.dir('equippable')

export default dir
