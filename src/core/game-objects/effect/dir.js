import * as dataSourceModdables from 'data-source-moddables'

/**
 * List of `name`s of loaded effects.
 *
 * @return {string[]} List of unique names.
 */
export const dir = () => dataSourceModdables.dir('effect')

export default dir
