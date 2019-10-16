import assert from 'assert'
import * as dataSourceGameObjects from 'data-source-game-objects'
import _ from 'lodash'
import * as armyRandom from './random'
import uuid from 'uuid/v1'

/**
 * Return a new army instance.
 *
 * @param {string} name of the army to create.
 *
 * @return {object} new army instance.
 */
export const create = ({name}) => {
  const army = dataSourceGameObjects.create({name, type: 'army'})

  // All objects get a unique id.
  army.id = uuid()

  // Instantiate effects, if any.
  army.effects = _.map(army.effects, (eff) => {
    return _.merge(dataSourceGameObjects.create({name: eff.name, type: 'effect'}), eff)
  })

  // instantiate equippables (should be rare to non-existent in most game play)
  army.equipment = _.map(army.equipment, (eq) => {
    // The following line is not testable until we DI the dataSourceGameObjects.
    return _.merge(dataSourceGameObjects.create({name: eq.name, type: 'equippable'}), eq)
  })

  return army
}

export default create

/**
 * Create a random army picked from the currently available list of valid armies.
 *
 * By default we assume the caller wants one army, but due to how groups of armies
 * are often needed, and batches need to be created, we allow the caller to create
 * de facto `army-group`s by calling this method with a size > 1.
 *
 * @param {object} args
 * @param {number} [size=1] how many armies to return.
 *
 * @return {object|object[]} new army instance if `size === 1` or array of
 * instances if `size > 1`.
 *
 * @throw {Error} if there appear to be no armies loaded.
 */
create.random = ({size = 1} = {}) => {
  assert(size > 0)
  const armies = armyRandom.random({size}).map((name) => create({name}))
  return size === 1 ? armies[0] : armies
}

/**
 * Create a single random army from a the set of armies with weighting rules
 * applied to the choice.
 *
 * Better armies will appear less often.
 *
 * @return {object} a single, weighted-random chosen army
 */
create.random.weighted = ({size = 1} = {}) => {
  assert(size > 0)
  const armies = armyRandom.weighted({size}).map((name) => create({name}))
  return size === 1 ? armies[0] : armies
}
