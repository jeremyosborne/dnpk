import * as configGameObjects from 'config-game-objects'
import chalk from 'chalk'
import * as gameObjects from 'game-objects'
import {init as l10nInit, t} from 'l10n'
import _ from 'lodash'
import {d} from 'random'
import {sprintf} from 'sprintf-js'

/**
 * Take an army group and return text information about the group.
 *
 * @param {object[]} group of armies
 *
 * @return {string} multi-line, slightly formatted, plain text diagnostic
 * information about the army group.
 */
const showGroup = (group) => {
  const strengthModifier = gameObjects.army.group.strengthModifier(group)
  const info = []
  // Overall group information.
  info.push(t('Army group bonus: {{bonus}}', {bonus: strengthModifier}))

  // Information about each unit in the army.
  group.reduce((info, army) => {
    const strength = gameObjects.army.strength(army)

    info.push(`${sprintf('%-17s', gameObjects.common.name(army))} ${sprintf('Str: %-3s', army.strength)} (Eff Str: ${strength}) (Battle Str: ${Math.min(9, strength + strengthModifier)})`)

    if (army.effects.length) {
      // Display army effects.
      info.push('  Effects: ' + _.map(army.effects, (eff) => {
        if (eff.name === 'terrain-battle-modifier') {
          // Terrain modifiers have embedded meta data that gets missed when
          // displaying only the effect name.
          return `${eff.magnitude > 0 ? '+' : '-'}${_.get(eff, 'metadata.name')}`
        } else {
          return gameObjects.common.name(eff)
        }
      }).join(', '))
    }

    if (army.equipment.length) {
      // Display army inventory.
      info.push('  Equipment: ' + _.map(army.equipment, (eq) => {
        return gameObjects.common.name(eq)
      }).join(', '))
    }

    return info
  }, info)

  return info.join('\n')
}

// mutates object passed in
const armyEquipRandom = (a) => {
  const eq = gameObjects.equippable.create.random()
  gameObjects.army.do.equip(a, eq)
  return a
}

const empireTitle = (empire) => console.log(chalk.hex(empire.color)(t('{{empire.name}}', {empire})))

const testPlayerCreate = ({
  groupSize = 8,
} = {}) => {
  // These test players are meant for battle simulation and each receive
  // one group.
  const group = _.times(groupSize, gameObjects.army.create.random)
  // Equip heroes with items.
  _.filter(group, gameObjects.army.is.hero)
    .forEach((a) => {
      a.nameInstance = gameObjects.naming.create({name: 'hero'})
      armyEquipRandom(a)
    })

  return {
    empire: gameObjects.empire.create.random(),
    group,
  }
}

// int main(void)
export const main = async () => {
  await l10nInit()
  await configGameObjects.load()

  console.log(t('Battle prototype'))

  console.log(t('Using ruleset: {rules}', {rules: gameObjects.rules.nameDefault()}))

  // const armyTypes = gameObjects.army.dir()
  // console.log(t('Armies available:'))
  // console.log(chalk.yellow(_.sortBy(armyTypes).join('\n')))

  console.log('')

  // Create 2 groups of armies and their leaders.

  // Not deduping empires right now. That's fine, we can have infighting.
  const player1 = testPlayerCreate()
  const player2 = testPlayerCreate()

  // Engage the 2 groups in battle.

  // Clone the attacking and defending groups. Battle can mutate the objects, but reports/events
  // out the results. The caller is responsible for handling the results of the
  // battle and applying permanent changes. Ideally this allows for a later rules
  // extensions where battle "kills" can be translated to "downed" or "injured"
  // or "captured" or "routed" units.
  const attackers = gameObjects.army.group.sort(_.cloneDeep(player1.group))

  // Create the defending group battle structure.
  const defenders = gameObjects.army.group.sort(_.cloneDeep(player2.group))

  console.log('\n\n\nBattle commencing between\n')

  // Who is fighting who.
  empireTitle(player1.empire)
  console.log(chalk.hex(player1.empire.color)(showGroup(attackers, player1.empire)))
  console.log('\nvs.\n')
  empireTitle(player2.empire)
  console.log(chalk.hex(player2.empire.color)(showGroup(defenders, player2.empire)))

  // While both groups still have units, keep going.
  const attackerCasualties = []
  const defenderCasualties = []
  while (attackers.length && defenders.length) {
    // Top of the stack current battle.
    const attacker = attackers[0]
    const attackerColor = player1.empire.color
    const attackerName = `${chalk.hex(attackerColor)(gameObjects.common.name(attacker))}`
    const attackerStrength = Math.min(9, gameObjects.army.group.strengthModifier(attackers) + gameObjects.army.strength(attacker))
    const defender = defenders[0]
    const defenderColor = player2.empire.color
    const defenderName = `${chalk.hex(defenderColor)(gameObjects.common.name(defender))}`
    const defenderStrength = Math.min(9, gameObjects.army.group.strengthModifier(defenders) + gameObjects.army.strength(defender))

    console.log(`\n${attackerName} ${chalk.hex(attackerColor)('(str:' + attackerStrength + ')')} vs. ${defenderName} ${chalk.hex(defenderColor)('(str:' + defenderStrength + ')')}`)

    while (attacker.health && defender.health) {
      const attackerRoll = d.standard()
      const attackerHit = attackerRoll > defenderStrength
      const defenderRoll = d.standard()
      const defenderHit = defenderRoll > attackerStrength
      // console.log('attackerHit: %s, defenderHit: %s', attackerHit, defenderHit)

      if ((attackerHit && defenderHit) || (!attackerHit && !defenderHit)) {
        console.log(`${attackerName} (${attackerRoll}) and ${defenderName} (${defenderRoll}) draw no blood.`)
      } else if (attackerHit) {
        console.log(`${attackerName} (${attackerRoll}) ${chalk.hex('#AA0000')('wounds')} ${defenderName} (${defenderRoll}).`)
        defender.health -= 1
      } else {
        console.log(`${defenderName} (${defenderRoll}) ${chalk.hex('#AA0000')('wounds')} ${attackerName} (${attackerRoll}).`)
        attacker.health -= 1
      }
    }

    if (attacker.health <= 0) {
      console.log(`${defenderName} ${chalk.hex('#AA0000')('slays')} ${attackerName}.`)
      // TODO: Handle casualties.
      attackerCasualties.push(attackers.shift())
    }
    if (defender.health <= 0) {
      console.log(`${attackerName} ${chalk.hex('#AA0000')('slays')} ${defenderName}.`)
      // TODO: Handle casualties.
      defenderCasualties.push(defenders.shift())
    }
  }

  console.log('\n\nBattle Results!')

  // Here attackers and defenders are the mutated copies of the group, not the original.
  empireTitle(player1.empire)
  console.log('# casualties:', attackerCasualties.length)
  console.log('# group remaining:', attackers.length)
  empireTitle(player2.empire)
  console.log('# casualties:', defenderCasualties.length)
  console.log('# group remaining:', defenders.length)

  if (attackers.length) {
    console.log(`The ${chalk.hex(player1.empire.color)(player1.empire.name)} empire wins the battle!`)
  }
  if (defenders.length) {
    console.log(`The ${chalk.hex(player2.empire.color)(player2.empire.name)} empire wins the battle!`)
  }

  // Return the battle group structure + statistics.
}

if (require.main === module) {
  main()
}
