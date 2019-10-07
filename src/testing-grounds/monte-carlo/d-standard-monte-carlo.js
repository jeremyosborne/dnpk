import * as gameObjects from 'game-objects'
import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'
import {d} from 'random'

export const dStandardMonteCarlo = async () => {
  const {times} = await prompt([
    {
      initial: 10000,
      message: t('Number of times to run the test (> 0)'),
      name: 'times',
      type: 'numeral',
      validate: (value) => _.isInteger(value) ? true : t('Value must be an integer.')
    }
  ])

  const counters = _.flow(
    // in number, out array of numbers
    (times) => _.times(times, d.standard),
    // in array of numbers, out dictionary of counts per number
    (rolls) => _.countBy(rolls),
    // in dictionary of counts per number, out unsorted array of descriptive objects
    (counts) => _.map(counts, (count, roll) => ({count, roll: _.parseInt(roll)})),
    // in unsorted array of descriptive objects, out sorted array of descriptive objects
    (countsList) => _.sortBy(countsList, (o) => o.roll)
  )(times)

  // Following purposely not translated because I'm not sure how I want to format
  // things or process the data.
  out('Distribution of results for d.standard()')
  // This isn't actually defined in the configurable rules...
  out('Minimum defined by rules:', 1)
  out('Maximum defined by rules:', gameObjects.rules.get('diceStandardMax'))
  out(`Total # of rolls: ${times}`)
  _.forEach(counters, (counter) => {
    out(`${counter.roll}: ${counter.count} (${_.round(counter.count / times, 2)})`)
  })
  out('')

  await hitReturnToContinue()
}

export default dStandardMonteCarlo