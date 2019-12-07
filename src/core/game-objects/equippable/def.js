import * as dataSourceModdables from 'data-source-moddables'

/**
 * Get a reference to an underlying, base definition, or an associative array of
 * all of the base definitions used as templates to create this type.
 */
export const def = (
  // The name of the specific reference. If not included, returns an associative
  // array of all references of this type.
  name: ?string
): any|void => {
  return dataSourceModdables.types.equippable.get(name)
}

export default def
