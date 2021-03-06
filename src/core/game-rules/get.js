import * as dataSourceModdables from 'data-source-moddables'
import nameDefault from './name-default'
import _ from 'lodash'

/**
 * Get a value from the set of rules.
 *
 * If called with one argument, gets a rule from the currently defined default
 * set of rules.
 *
 * If called with two arguments, first argument is the name of the rule set,
 * second argument is the rule to be returned.
 *
 * @param {...*} args variable set of arguments.
 */
export const get = (...args) => {
  let ruleAttr
  let ruleSetName

  if (args.length === 1) {
    ruleAttr = args[0]
    ruleSetName = nameDefault()
  } else {
    ruleAttr = args[1]
    ruleSetName = args[0]
  }

  return _.get(dataSourceModdables.types.rules.get(ruleSetName), ruleAttr)
}

export default get
