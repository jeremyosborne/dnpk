import * as army from '../army'
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
 * @param {object} args
 * @param {number} [size=8] size of the army-group returned.
 *
 * @return {object[]} army instances in an army-group.
 */
create.random = ({size = 8} = {}) => {
  const armies = army.create.random({size})
  // Compensate for the fact that an army-group of size === 1 is valid but the
  // behavior of the create function defaults as a single object factory.
  return Array.isArray(armies) ? armies : [armies]
}

/**
 * Create a randomized army-group from a the set of armies with weighting rules
 * applied to the choice.
 *
 * @param {object} args
 * @param {number} [size=8] size of the army-group returned.
 *
 * @return {object[]} army instances in an army-group.
 */
create.random.weighted = ({size = 8} = {}) => {
  const armies = army.create.random.weighted({size})
  // Compensate for the fact that an army-group of size === 1 is valid but the
  // behavior of the create function defaults as a single object factory.
  return Array.isArray(armies) ? armies : [armies]
}
