import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'
import {randomTerrain} from 'simulation'

const validate = {
  isInteger: (value) => _.isInteger(value) ? true : t('Value must be an integer.')
}

export const randintMonteCarlo = async () => {
  const {max, min} = await prompt([
    {
      initial: 0,
      message: t('minimum value for x and y'),
      name: 'min',
      type: 'numeral',
      validate: validate.isInteger,
    },
    {
      initial: 1000,
      message: t('maximum value for x and y'),
      name: 'max',
      type: 'numeral',
      validate: validate.isInteger,
    },
  ])

  const counters = _.flow(
    // in numbers, out array of terrain objects
    ({max, min, times}) => {
      const terrains = []
      for (let y = min; y <= max; y++) {
        for (let x = min; x <= max; x++) {
          terrains.push(randomTerrain.create({x, y}))
        }
      }
      return terrains
    },
    // in array of terrain objects, out dictionary of counts per terrain name
    (terrains) => _.countBy(terrains, 'name'),
    // in dictionary of counts per terrain name, out unsorted array of descriptive objects
    (counts) => _.map(counts, (count, name) => ({count, name})),
    // in unsorted array of descriptive objects, out sorted array of descriptive objects
    (countsList) => _.sortBy(countsList, (o) => o.name)
  )({max, min})

  // For figuring out distribution.
  const times = Math.pow(max - min, 2)
  out('Distribution of results for randomTerrain.create({x, y})')
  out('Minimum:', min)
  out('Maximum:', max)
  out('Number of calls:', times)
  _.forEach(counters, (counter) => {
    out(`${counter.name}: ${counter.count} (${_.round(counter.count / times, 2)})`)
  })
  out('')

  await hitReturnToContinue()
}

export default randintMonteCarlo
