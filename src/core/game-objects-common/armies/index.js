import armiesBase from './armies'
import kill from './kill'
import _ from 'lodash'
import sort from './sort'

// Extend the base public object when imported from the full module.
export const armies = _.clone(armiesBase)
armies.kill = kill
armies.sort = sort

// Exception to the usual `import * as module from 'module'` rule due to
// usage of function factory.
export default armies
