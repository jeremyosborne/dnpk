import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'
import {randint} from 'random'

export const randintMonteCarlo = async () => {
  const {max, min, times} = await prompt([
    {
      initial: 1,
      message: t('minimum value'),
      name: 'min',
      type: 'numeral',
      validate: (value) => _.isInteger(value) ? true : t('Value must be an integer.')
    },
    {
      initial: 10,
      message: t('maximum value'),
      name: 'max',
      type: 'numeral',
      validate: (value) => _.isInteger(value) ? true : t('Value must be an integer.')
    },
    {
      initial: 10000,
      message: t('Number of times to run the test'),
      name: 'times',
      type: 'numeral',
      validate: (value) => _.isInteger(value) ? true : t('Value must be an integer.')
    }
  ])

  const counters = _.flow(
    // in number, out array of numbers
    ({max, min, times}) => _.times(times, () => randint(min, max)),
    // in array of numbers, out dictionary of counts per number
    (rolls) => _.countBy(rolls),
    // in dictionary of counts per number, out unsorted array of descriptive objects
    (counts) => _.map(counts, (count, roll) => ({count, roll: _.parseInt(roll)})),
    // in unsorted array of descriptive objects, out sorted array of descriptive objects
    (countsList) => _.sortBy(countsList, (o) => o.roll)
  )({max, min, times})

  // Following purposely not translated because I'm not sure how I want to format
  // things or process the data.
  out('Distribution of results for randint(min, max)')
  // This isn't actually defined in the configurable rules...
  out('Minimum:', min)
  out('Maximum:', max)
  out(`Total # of rolls: ${times}`)
  _.forEach(counters, (counter) => {
    out(`${counter.roll}: ${counter.count} (${_.round(counter.count / times, 2)})`)
  })
  out('')

  await hitReturnToContinue()
}

export default randintMonteCarlo
