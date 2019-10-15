import * as army from '../army'
import _ from 'lodash'
// import uuid from 'uuid/v1'

/**
 * Return a new army-group object, which right now is just an array.
 *
 * This function was put in to keep in sync with the existing `army.create`
 * method, and to expose random army-group creation more than to facilite
 * creation of army-groups. However, when the time comes, this function is now
 * here.
 *
 * @return {object} new army-group instance.
 */
export const create = () => {
  const armyGroup = []

  // Probably want this someday.
  // armyGroup.id = uuid()

  return armyGroup
}

export default create

/**
 * Create a random army-group picked from the currently available list of valid
 * armies.
 *
 * @return {object} new army instance.
 *
 * @throw {Error} if there appear to be no armies loaded.
 */
create.random = ({size = 8} = {}) => {
  const names = army.dir()
  if (!names.length) {
    throw new Error('armyGroup.create.random: no army names available. Did you load the armies before calling this method?')
  }

  return _.sampleSize(army.dir(), size).map((name) => army.create({name}))
}

/**
 * Create a randomized army-group from a the set of armies with weighting rules
 * applied to the choice.
 *
 * Better armies will appear less often in the group.
 *
 * @return {object} a single, weighted-random chosen army
 */
create.random.weighted = ({size = 8} = {}) => {
  return army.sampleWeighted({size})
}
