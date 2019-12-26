import effects from '../effects'

/**
 * Determine if the object (assumed to be an army) is duck typed as a hero.
 *
 * @param {object} o object to test for heroism.
 *
 * @return {boolean} true or false
 */
export const hero = (o) => {
  // The only determination of a hero is an object that implements effects
  // and that there is at least one effect with a hero effect as magnitude
  // doesn't matter in our current implementation of the `hero` effect.
  return effects.hasName(o, 'hero')
}

export default hero
