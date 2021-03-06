import equipment from "./equipment"
import _ from "lodash"

/**
 * Take an item `from` one owner and transfer `to` another owner.
 *
 * Mutates objects `from` and `to`.
 */
export const transfer = (
  // The object being transfered. If object, must implement id.
  // If string, assumed to be id of object being tansferred.
  object,
  // Object item will be transferred from, which implements `transferKey`.
  from,
  // Object item will be transferred to, which implements `transferKey`.
  to
  //, {
  //   // Future planning: likely will pull this into the basic object-list.
  //   // If moved into the basic object-list, the implementation itself will
  //   // take care of this and this config param can drop out.
  //   transferKey = "equipment",
  // } = {}
) => {
  // Allow for string entries.
  if (_.isString(object)) {
    // good enough implmentation for the removal process.
    object = { id: object }
  }
  // Get the actual object in case the caller passed in a partial.
  // Relies on the general principal `id`s are universally unique within
  // an application run.
  const transferred = equipment.remove(from, object)
  equipment.add(to, transferred)
}

export default transfer
