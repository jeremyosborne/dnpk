import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'
import {sampleWeighted} from 'random'

const validate = {
  isInteger: (value) => _.isInteger(value) ? true : t('Value must be an integer.')
}

export const sampleWeightedMonteCarlo = async () => {
  const {times, ...weights} = await prompt([
    {
      initial: 1,
      message: t('weight of "item 1"'),
      name: 'item 1',
      type: 'numeral',
      validate: validate.isInteger,
    },
    {
      initial: 3,
      message: t('weight of "item 2"'),
      name: 'item 2',
      type: 'numeral',
      validate: validate.isInteger,
    },
    {
      initial: 10,
      message: t('weight of "item 3"'),
      name: 'item 3',
      type: 'numeral',
      validate: validate.isInteger,
    },
    {
      initial: 10000,
      message: t('number of samples to take'),
      name: 'times',
      type: 'numeral',
      validate: validate.isInteger,
    }
  ])

  const counters = _.flow(
    // in number, out array of numbers
    ({weights, times}) => sampleWeighted({
      choices: ['item 1', 'item 2', 'item 3'],
      size: times,
      weight: (o) => weights[o]
    }),
    // in array of choices, out dictionary of counts per choice
    (choices) => _.countBy(choices),
    // in dictionary of counts per choice, out unsorted array of descriptive objects
    (counts) => _.map(counts, (count, choice) => ({count, choice})),
    // in unsorted array of descriptive objects, out sorted array of descriptive objects
    (countsList) => _.sortBy(countsList, (o) => o.choice)
  )({weights, times})

  // Following purposely not translated because I'm not sure how I want to format
  // things or process the data.
  out('Distribution of results for calls to sampleWeighted')
  out(`Total # of samples: ${times}`)
  _.forEach(counters, (counter) => {
    out(`${counter.choice}: ${counter.count} (${_.round(counter.count / times, 2)})`)
  })
  out('')

  await hitReturnToContinue()
}

export default sampleWeightedMonteCarlo
