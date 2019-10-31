import * as objectList from '../object-list'

/**
 * Helpers for working with sets of `equipment` on an object.
 *
 * see: object-list
 */
export const equipment = objectList.create({attrPath: 'equipment'})

// Exception to the usual `import * as module from 'module'` rule due to
// usage of function factory.
export default equipment
