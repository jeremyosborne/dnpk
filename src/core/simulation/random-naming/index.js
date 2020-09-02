import * as dataSourceModdables from 'data-source-moddables'
import _ from 'lodash'

/**
 * Return a single, random choice from a particular `naming` group.
 *
 * Odd nomenclature due to pervasive use of `name` to mean somethiing different
 * within the game code.
 *
 * @param {object} args
 * @param {array} [args.exclude] values will be excluded from the potential set
 * from which we sample.
 * @param {string} [args.name='hero'] the grouping to pull the name from. If not
 * included, a default will always be available.
 *
 * @return {string} new naming for your army.
 */
export const randomNaming = ({
  exclude = [],
  name = 'army',
} = {}) => {
  // Full names should be returned as an array of strings in the `namings` prop.
  let {namings} = dataSourceModdables.types.naming.get(name)
  namings = _.filter(namings, (name) => !_.includes(exclude, name))
  if (!namings.length) {
    throw new Error('randomNaming: no list of namings available. Did you load the objects before calling this method, or did you exclude too many?')
  }

  return _.sample(namings)
}

export default randomNaming
