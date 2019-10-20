import uuid from 'uuid/v1'

/**
 * Return a new army-group object, which is an augmented array.
 *
 * This function was put in to keep in sync with the existing `army.create`
 * method, and to expose random army-group creation more than to facilite
 * creation of army-groups. However, when the time comes, this function is now
 * here.
 *
 * @return {array} new army-group instance.
 */
export const create = () => {
  const armyGroup = []

  armyGroup.id = uuid()
  armyGroup.type = 'army-group'

  return armyGroup
}

export default create
