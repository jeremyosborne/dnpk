import * as configGameObjects from 'config-game-objects'
import chalk from 'chalk'
import * as gameObjects from 'game-objects'
import {init as l10nInit, t} from 'l10n'
import _ from 'lodash'
import {d} from 'random'
import {sprintf} from 'sprintf-js'

const showGroup = (group, empire) => {
  const strengthModifier = gameObjects.army.group.strengthModifier(group)
  console.log(`${chalk.hex(empire.color)(t('Army group bonus: {{bonus}}', {bonus: strengthModifier}))}`)
  console.log(`${chalk.hex(empire.color)(group.reduce((info, army) => {
    const strength = gameObjects.army.strength(army)
    info.push(`${sprintf('%-17s', gameObjects.common.name(army))} ${sprintf('Str: %-3s', army.strength)} (Eff Str: ${strength}) (Battle Str: ${Math.min(9, strength + strengthModifier)})`)
    return info
  }, []).join('\n'))}`)
}

// mutates object passed in
const heroEquipRandom = (a, empire) => {
  const eq = gameObjects.equippable.create.random()
  console.log(chalk.hex(empire.color)(`Equipping ${gameObjects.common.name(a)} with ${gameObjects.common.name(eq)}`))
  gameObjects.army.do.equip(a, eq)

  return a
}

const empireTitle = (empire) => console.log(chalk.hex(empire.color)(t('{{empire.name}}', {empire})))

// int main(void)
export const main = async () => {
  await l10nInit()
  await configGameObjects.load()

  console.log(t('Battle prototype'))

  console.log(t('Using ruleset: {rules}', {rules: gameObjects.rules.nameDefault()}))

  const armyTypes = gameObjects.army.dir()
  console.log(t('Armies available:'))
  console.log(chalk.yellow(_.sortBy(armyTypes).join('\n')))

  // Create 2 groups of armies.

  console.log('')

  const player1 = {
    empire: gameObjects.empire.create.random(),
    group: _.times(8, gameObjects.army.create.random)
  }
  empireTitle(player1.empire)
  // Equip heroes with items.
  _.filter(player1.group, gameObjects.army.is.hero)
    .forEach((a) => {
      a.nameInstance = gameObjects.naming.create({name: 'hero'})
      heroEquipRandom(a, player1.empire)
    })
  showGroup(player1.group, player1.empire)

  console.log('')

  // Not deduping empires right now. That's fine, we can have infighting.
  const player2 = {
    empire: gameObjects.empire.create.random(),
    group: _.times(8, gameObjects.army.create.random)
  }
  empireTitle(player2.empire)
  // Equip heroes with items.
  _.filter(player2.group, gameObjects.army.is.hero)
    .forEach((a) => {
      a.nameInstance = gameObjects.naming.create({name: 'hero'})
      heroEquipRandom(a, player2.empire)
    })
  showGroup(player2.group, player2.empire)

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
  showGroup(attackers, player1.empire)
  console.log('vs.')
  empireTitle(player2.empire)
  showGroup(defenders, player2.empire)

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
