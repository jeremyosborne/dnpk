import _ from 'lodash'

/**
 * Is this army a `hero` or not?
 *
 * @param {object} army under test
 * @return {boolean} true if this army is considered a `hero`, false if not.
 */
export const hero = (army) => _.some(army.effects, (eff) => eff.name === 'hero')

export default hero
