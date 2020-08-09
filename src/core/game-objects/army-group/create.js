import _ from 'lodash'
import uuid from 'uuid/v1'

/**
 * Return a new army-group object.
 *
 * History: code started off with simple arrays representing groups of armies,
 * but then saving and loading came into the picture, and the idea of the `army-group`
 * having some significance over time (which isn't classic warlords) and I realized
 * it's better to have a normal object structure, which is easier to searialize
 * with meta data instead of just having plain arrays.
 *
 * @param {object[]} [armies=[]] any existing army objects that may have been
 * generated from other creation methods.
 *
 * @return {object} new army-group
 */
export const create = ({armies} = {}) => {
  armies = armies ? _.clone(armies) : []
  return {
    armies,

    createdAt: new Date().toISOString(),

    // asserted future property... could hold effects of battles on the units
    // in this group, usually more positive than negative to encourage keeping
    // good groups reinforced.
    // effects: [],

    id: uuid(),

    // asserted future property... of which I need to figure out since I don't
    // understand the hierarchy of naming groups of soldiers.
    // maybe simplistic yet descriptive names like 'patrol' or 'garrison'...
    // name: 'platoon',

    type: 'army-group',
  }
}

export default create
