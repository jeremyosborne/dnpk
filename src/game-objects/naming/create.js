import * as configGameObjects from 'config-game-objects'
import dir from './dir'
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
  const {namings} = configGameObjects.create({name, type: 'naming'})

  return _.sample(namings)
}

export default create

/**
 * Create a random name picked from the entire set of names.
 *
 * @return {string} a new name
 *
 * @throw {Error} if there appear to be no naming groups loaded.
 */
create.random = () => {
  const name = _.sample(dir())
  if (!name) {
    throw new Error('empire.create.random: no empire names available. Did you load the empire before calling this method?')
  }

  return create({name})
}
