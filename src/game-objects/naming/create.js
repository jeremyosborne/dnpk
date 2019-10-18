import * as dataSourceModdables from 'data-source-moddables'
import _ from 'lodash'

/**
 * Return one name from a naming group that can be applied as a `nameInstance`
 * to a unit.
 *
 * Unlike other instance generators, this returns a random, simple string
 * from the available list of strings.
 *
 * @param {string} name the grouping to pull the name from.
 *
 * @return {string} new name for your unit.
 */
export const create = ({name}) => {
  const {namings} = dataSourceModdables.create({name, type: 'naming'})

  return _.sample(namings)
}

export default create
