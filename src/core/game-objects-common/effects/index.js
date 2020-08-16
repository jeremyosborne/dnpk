import * as gameObjects from 'game-objects'
import _ from 'lodash'
import * as objectList from '../object-list'

/**
 * Helpers for working with sets of `effects` on an object.
 *
 * see: object-list
 */
export const effects = objectList.create({attrPath: 'effects'})

// Exception to the usual `import * as module from 'module'` rule due to
// usage of function factory.
export default effects

//
// Extended API.
//

//
// Blessings.
//
// See `docs/blessings-and-shrines.md`.
//

/**
 * Blessings are effects with meta data and constraints unique to the `blessing`
 * sub-type.
 *
 * @type {Object}
 */
effects.blessings = {}

const DEFAULT_BLESSING_EFFECT_NAME = 'brawn'

/**
 * Has a particular object been granted a blessing of a particular type
 * from a particular entity?
 *
 * @param {object|object[]} o requires something that implements `effects`
 * or a simple array of effects.
 * @param {string} granter official name of the diety providing this blessing.
 *
 * @param {object} [config]
 * @param {String} [config.name='brawn'] the type of effect that makes up
 * this blessing, which also must be matched.
 *
 * @return {Boolean}
 */
effects.blessings.has = (o, granter, {
  name = DEFAULT_BLESSING_EFFECT_NAME,
} = {}) => {
  return _.some(effects.get(o), (effect) => _.get(effect, 'name') === name && _.get(effect, 'metadata.comesFrom') === granter)
}

/**
 * Add a blessing to a particular object if that blessing has not already been
 * granted.
 *
 * @param {object|object[]} o requires something that implements `effects`
 * or a simple array of effects.
 * @param {string} granter official name of the diety providing this blessing.
 *
 * @param {object} [config]
 * @param {String} [config.name='brawn'] the type of effect that makes up
 * this blessing.
 * @param {Number} [config.magnitude=1] the strength of the blessing.
 */
effects.blessings.add = (o, granter, {
  name = DEFAULT_BLESSING_EFFECT_NAME,
  magnitude = 1,
} = {}) => {
  if (!effects.blessings.has(o, granter, {name})) {
    const effect = gameObjects.effect.create({name})
    effect.magnitude = magnitude
    // Additional shrine meta-info.
    _.set(effect, 'metadata.comesFrom', granter)
    effects.add(o, effect)
  }
}
