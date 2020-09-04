import * as objectList from '../object-list'

/**
 * Helpers for working with sets of `cosmetics` on an object.
 *
 * see: object-list
 */
export const deeds = objectList.create({attrPath: 'deeds'})

// Exception to the usual `import * as module from 'module'` rule due to
// usage of function factory.
export default deeds
