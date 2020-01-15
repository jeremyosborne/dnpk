import * as dataSourceModdables from 'data-source-moddables'
import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'
import {randomWeightedArmies, randomWeightedArmyWeighting} from 'simulation'
import {sprintf} from 'sprintf-js'

const validate = {
  isInteger: (value) => _.isInteger(value) ? true : t('Value must be an integer.')
}

export const randomWeightedArmiesMonteCarlo = async () => {
  const {times} = await prompt([
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
    ({times}) => randomWeightedArmies({
      size: times,
    }),
    // in array of choices, out dictionary of counts per choice
    (choices) => _.countBy(choices),
    // in dictionary of counts per choice, out unsorted array of descriptive objects
    (counts) => _.map(counts, (count, choice) => ({count, choice})),
    // in unsorted array of descriptive objects, out sorted array by counts
    (countsList) => _.orderBy(countsList, ['count'], ['desc'])
  )({times})

  // Following purposely not translated because I'm not sure how I want to format
  // things or process the data.
  out('Distribution of results for calls to randomWeightedArmies')
  out(`Total # of samples: ${times}`)
  _.forEach(counters, (counter) => {
    const armyRef = dataSourceModdables.types.army.get(counter.choice)
    const armyWeight = randomWeightedArmyWeighting(counter.choice)
    out(`${sprintf('%-17s', counter.choice)}: ${counter.count} (${_.round(counter.count / times, 2)}) (str: ${armyRef.strength}) (weight: ${armyWeight})`)
  })
  out('')

  await hitReturnToContinue()
}

export default randomWeightedArmiesMonteCarlo
