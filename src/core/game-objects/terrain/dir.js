import * as dataSourceModdables from 'data-source-moddables'

/**
 * List of `name`s of loaded entities.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => dataSourceModdables.dir('terrain')

export default dir
