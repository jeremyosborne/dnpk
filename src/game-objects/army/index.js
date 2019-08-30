// army-group public API, part of army API.

// because reserve words
import * as doAction from './do' // eslint-disable-line import/first
export {doAction as do}

import * as group from './group' // eslint-disable-line import/first
export {group}

import * as is from './is' // eslint-disable-line import/first
export {is}

export {create} from './create'
export {dir} from './dir'
export {strengthEffective} from './strength-effective'
