import {violence} from 'battle'
import {prompt} from 'enquirer'
import hitReturnToContinue from 'hit-return-to-continue'
import {t} from 'l10n'
import _ from 'lodash'
import out from 'out'

export const create = async () => {
  const validate = (value) => (_.isInteger(value) && value >= 0 && value <= 9) ? true : t('Value must be an integer >= 0 and <= 9')
  const {attackerStrength, defenderStrength, times} = await prompt([
    {
      message: t('Strength of attacker (between 0 and 9)'),
      name: 'attackerStrength',
      type: 'numeral',
      validate,
    },
    {
      message: t('Strength of defender (between 0 and 9)'),
      name: 'defenderStrength',
      type: 'numeral',
      validate,
    },
    {
      initial: 10000,
      message: t('Number of times to run the test (> 0)'),
      name: 'times',
      type: 'numeral',
      validate: (value) => _.isInteger(value) ? true : t('Value must be an integer.')
    }
  ])

  const counts = _.times(times, () => violence({attacker: {strength: attackerStrength}, defender: {strength: defenderStrength}}))
    .reduce((counters, result) => {
      // Assumes classic rules where only 1 can be damaged.
      if (result.attacker.damaged) {
        counters.defender += 1
      } else if (result.defender.damaged) {
        counters.attacker += 1
      } else {
        counters.draw += 1
      }
      return counters
    }, {attacker: 0, defender: 0, draw: 0})

  // Following purposely not translated because I'm not sure how I want to format
  // things or process the data.
  out('Results against total rolls')
  out(`Attacker wins: ${counts.attacker} (${_.round(counts.attacker / times, 2)})`)
  out(`Defender wins: ${counts.defender} (${_.round(counts.defender / times, 2)})`)
  out(`Draws: ${counts.draw} (${_.round(counts.draw / times, 2)})`)
  out(`Total: ${times}`)
  out('')
  out('Results for only significant values (no draws)')
  out(`Attacker wins: ${counts.attacker} (${_.round(counts.attacker / (counts.attacker + counts.defender), 2)})`)
  out(`Defender wins: ${counts.defender} (${_.round(counts.defender / (counts.attacker + counts.defender), 2)})`)
  out(`Total: ${counts.attacker + counts.defender}`)

  await hitReturnToContinue()
}

export default create
