import * as dataSourceModdables from 'data-source-moddables'

/**
 * List of `name`s of loaded terrain.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => dataSourceModdables.dir('structure')

export default dir