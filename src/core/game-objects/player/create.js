import {v1 as uuid} from 'uuid'

/**
 * Return a new player instance.
 *
 * At the time of initial writing, this is acting as the definition of a player
 * object even though it doesn't do very much.
 *
 * @return {object} new player instance.
 */
export const create = () => {
  return {
    /**
     * The standing army for this player.
     * @type {object[]}
     */
    armyGroups: [],

    /**
     * 1:1 empire to player.
     * @type {object}
     */
    empire: null,

    /**
     * All instances get ids.
     * @type {string}
     */
    id: uuid(),

    metadata: {
      createdAt: new Date().toISOString(),
    },

    // future planned extension, allows for type of player, like `human`
    // name: 'human',

    /**
     * Keep with the duck-typing.
     * @type {string}
     */
    type: 'player',
  }
}

export default create
