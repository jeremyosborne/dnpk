import _ from 'lodash'
import {randint as _randint} from './random'

/**
 * Linear scan method for choosing items from an array of items.
 *
 * @param {object} args
 * @param {object[]} args.choices set of objects to choose from.
 * @param {number} [args.size=1] how many items to pick.
 * @param {function} args.weight receives each object and returns a relative, integer
 * weight compared to the other choices in the list.
 *
 * @param {object} config
 * @param {function} randint
 *
 * @return {object[]} the object(s) picked.
 */
export const sampleWeighted = ({
  choices = [],
  size = 1,
  weight = () => 1,
} = {}, {
  randint = _randint
} = {}) => {
  const choicesWeight = _.map(choices, weight)
  const totalWeight = _.sum(choicesWeight)
  const picks = []
  _.times(size, () => {
    let r = randint(1, totalWeight)
    for (let i = 0; i < choicesWeight.length; i++) {
      r -= choicesWeight[i]
      if (r <= 0) {
        picks.push(choices[i])
        return
      }
    }
    throw new Error(`sampleWeighted fell through with choices: ${choices}; size: ${size}; weight: ${weight}`)
  })
  return picks
}

export default sampleWeighted
