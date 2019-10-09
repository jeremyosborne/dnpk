import _ from 'lodash'
import _randint from './randint'

/**
 * Linear scan method for choosing items from an array of items.
 *
 * @param {object[]} choices set of objects to choose from.
 * @param {number} [pick=1] how many items to pick.
 * @param {function} weight receives each object and returns a relative, integer
 * weight compared to the other choices in the list.
 *
 * @return {object[]} the object(s) picked.
 */
export const sampleWeighted = ({
  choices = [],
  pick = 1,
  weight = () => 1,
} = {}, {
  randint = _randint
} = {}) => {
  const choicesWeight = _.map(choices, weight)
  const totalWeight = _.sum(choicesWeight)
  const picks = []
  _.times(pick, () => {
    let r = randint(1, totalWeight)
    for (let i = 0; i < choicesWeight.length; i++) {
      r -= choicesWeight[i]
      if (r <= 0) {
        picks.push(choices[i])
        return
      }
    }
    throw new Error(`sampleWeighted fell through with choices: ${choices}; pick: ${pick}; weight: ${weight}`)
  })
  return picks
}

export default sampleWeighted
