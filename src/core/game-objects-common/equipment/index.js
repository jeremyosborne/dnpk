import equipmentBase from './equipment'
import _ from 'lodash'
import transfer from './transfer'

// Extend the base public object when imported from the full module.
export const equipment = _.clone(equipmentBase)
equipment.transfer = transfer

// Exception to the usual `import * as module from 'module'` rule due to
// usage of function factory.
export default equipment
