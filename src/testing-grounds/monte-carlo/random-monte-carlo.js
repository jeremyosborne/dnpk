import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'
import {random} from 'random'

export const randomMonteCarlo = async () => {
  const validate = (value) => _.isInteger(value) ? true : t('Value must be an integer.')
  const {times} = await prompt([
    {
      initial: 100000,
      message: t('Number of times to run test'),
      name: 'times',
      type: 'numeral',
      validate,
    }
  ])

  // Assumed potential min and max boundaries.
  const min = 0
  const max = 1
  // Decimal precision of reporting
  const precision = 1

  const counters = _.flow(
    // in number, out array of floats
    (times) => _.times(times, random),
    // in array of floats, out dictionary of counts per range of float plus boundary markers
    (nums) => _.countBy(nums, (num) => {
      // Treat boundary extremes as special.
      if (num === min) {
        return min
      } else if (num === max) {
        return max
      } else {
        const lowerBound = _.floor(num, precision) === _.ceil(num, precision)
          // Bump midrange boundaries down a group...
          ? _.floor(num - (1 / Math.pow(10, precision)), precision)
          : _.floor(num, precision)
        // Lower boundary is grouped separately and in own group.
        const lowerBoundOperator = lowerBound === min ? '<' : '<='
        // Group by range otherwise.
        return `${lowerBound} ${lowerBoundOperator} x < ${_.ceil(num, precision)}`
      }
    }),
    // inspect counts and if min or max boundaries don't exist, add them for reporting.
    // in dictionary of counts, out dictionary of counts
    (counts) => {
      if (!counts[min]) {
        counts[min] = 0
      }
      if (!counts[max]) {
        counts[max] = 0
      }
      return counts
    },
    // in dictionary of counts per range + boundaries, out unsorted array of descriptive objects
    (counts) => _.map(counts, (count, range) => ({count, range})),
    // in unsorted array of descriptive objects, out sorted array of descriptive objects
    (countsList) => _.sortBy(countsList, (o) => parseFloat(_.split(o.range, ' ')[0]))
  )(times)

  // Following purposely not translated because I'm not sure how I want to format
  // things or process the data.
  out('Distribution of results for random()')
  out(`Total # of rolls: ${times}`)
  _.forEach(counters, (counter) => {
    out(`${counter.range}: ${counter.count} (${_.round(counter.count / times, 2)})`)
  })
  out('')

  await hitReturnToContinue()
}

export default randomMonteCarlo
