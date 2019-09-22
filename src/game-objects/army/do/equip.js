
/**
 * Add a piece of equipment to an army.
 *
 * This will mutate the army object.
 *
 * @param {object} args as dictionary
 * @param {object} args.army receives equipment
 * @param {object} args.equippable added as reference in army's equipment
 */
export const equip = ({army, equippable}) => {
  // Like most attributes, the equipment array is required to exist on all
  // army instances, so no test for it.
  army.equipment.push(equippable)
}

export default equip
