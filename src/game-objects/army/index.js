// army-group public API, part of army API.

export {create} from './create'
export {dir} from './dir'
// because reserved words
import * as doAction from './do' // eslint-disable-line import/first
export {doAction as do}
import * as group from './group' // eslint-disable-line import/first
export {group}
import * as is from './is' // eslint-disable-line import/first
export {is}
export {strength} from './strength'
