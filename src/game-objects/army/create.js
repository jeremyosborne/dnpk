import * as dataSourceGameObjects from 'data-source-game-objects'
import dir from './dir'
import * as armyIs from './is'
import _ from 'lodash'
import * as random from 'random'
import armyStrength from './strength'
import uuid from 'uuid/v1'

/**
 * Create a random set of armies.
 *
 * This function governs the rules for choosing a set of armies around general weighting
 * rules. Convenience methods are exposed elsewhere as `*.random.weighted` for singular
 * `army` and `army-group` construction that apply defaults for their respective
 * uses. Recommend using those functions.
 *
 * @return {object[]} a random-by-weighting list of armies.
 *
 * @throw {Error} if there appear to be no armies loaded.
 */
export const sampleWeighted = ({size = 1} = {}) => {
  let armies = dir()
  if (!armies.length) {
    throw new Error('army.create.sampleWeighted: no army names available. Did you load the armies before calling this method?')
  }
  // There's no raw def ref at the moment, so create throwaway objects that
  // have strength references that we can use to weight the army selection.
  armies = armies.map((name) => create({name}))

  return random.sampleWeighted({
    choices: armies,
    size,
    // Rules for choosing random armies.
    weight: (a) => {
      // Heroes lowest weight.
      if (armyIs.hero(a)) {
        return 1
      }
      const strength = armyStrength(a)
      // Everything has a higher chance of being picked over a hero.
      return 10 - strength + 2 * (10 - strength)
    }
  }).map((a) => create({name: a.name}))
}

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
 * @return {object} new army instance.
 *
 * @throw {Error} if there appear to be no armies loaded.
 */
create.random = () => {
  const name = _.sample(dir())
  if (!name) {
    throw new Error('army.create.random: no army names available. Did you load the armies before calling this method?')
  }

  return create({name})
}

/**
 * Create a single random army from a the set of armies with weighting rules
 * applied to the choice.
 *
 * Better armies will appear less often.
 *
 * @return {object} a single, weighted-random chosen army
 */
create.random.weighted = () => {
  return sampleWeighted({size: 1})[0]
}
