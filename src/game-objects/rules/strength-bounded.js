import * as gameObjects from 'game-objects'

/**
 * Make sure a strength value is valid within the rule set.
 *
 * @param {number} strength the raw strength.
 *
 * @return {number} the constrained value of the strength.
 */
export const strengthBounded = (strength = 0) => {
  return Math.max(gameObjects.rules.get('unitStrengthMin'), Math.min(strength, gameObjects.rules.get('unitStrengthMax')))
}

export default strengthBounded
