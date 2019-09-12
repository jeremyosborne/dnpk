import * as configGameObjects from 'config-game-objects'
import chalk from 'chalk'
import * as gameObjects from 'game-objects'
import {init as l10nInit, t} from 'l10n'
import _ from 'lodash'
import {d} from 'random'
import * as simulation from 'simulation'
import * as ui from 'ui'

const empireTitle = (empire) => console.log(chalk.hex(empire.color)(gameObjects.common.name(empire)))

// int main(void)
export const main = async () => {
  await l10nInit()
  await configGameObjects.load()

  console.log(t('Battle prototype'))

  console.log(t('Using ruleset: {{rules}}', {rules: gameObjects.rules.nameDefault()}))

  // const armyTypes = gameObjects.army.dir()
  // console.log(t('Armies available:'))
  // console.log(chalk.yellow(_.sortBy(armyTypes).join('\n')))

  // Create 2 groups of armies and their leaders.

  // Not deduping empires right now. That's fine, we can have infighting.
  const player1 = simulation.create.playerRandom()
  const player2 = simulation.create.playerRandom()

  // Engage the 2 groups in battle.

  // Clone the attacking and defending groups. Battle can mutate the objects, but reports/events
  // out the results. The caller is responsible for handling the results of the
  // battle and applying permanent changes. Ideally this allows for a later rules
  // extensions where battle "kills" can be translated to "downed" or "injured"
  // or "captured" or "routed" units.
  const attackers = gameObjects.armyGroup.sort(_.cloneDeep(player1.armyGroups[0]))

  // Create the defending group battle structure.
  const defenders = gameObjects.armyGroup.sort(_.cloneDeep(player2.armyGroups[0]))

  console.log('\nBattle commencing between\n')

  // Who is fighting who.
  empireTitle(player1.empire)
  console.log(chalk.hex(player1.empire.color)(ui.text.armyGroup(attackers)))
  console.log('\nvs.\n')
  empireTitle(player2.empire)
  console.log(chalk.hex(player2.empire.color)(ui.text.armyGroup(defenders)))

  // While both groups still have units, keep going.
  const attackerCasualties = []
  const defenderCasualties = []
  while (attackers.length && defenders.length) {
    // Top of the stack current battle.
    const attacker = attackers[0]
    const attackerColor = player1.empire.color

    const attackerName = `${chalk.hex(attackerColor)(gameObjects.common.name(attacker))}`
    const attackerStrength = gameObjects.rules.strengthBounded(gameObjects.armyGroup.strengthModifier(attackers) + gameObjects.army.strength(attacker))
    const defender = defenders[0]
    const defenderColor = player2.empire.color
    const defenderName = `${chalk.hex(defenderColor)(gameObjects.common.name(defender))}`
    const defenderStrength = gameObjects.rules.strengthBounded(gameObjects.armyGroup.strengthModifier(defenders) + gameObjects.army.strength(defender))

    // Event: battle-round-start
    // {attacker, attackerHealth, attackerStrength, defender, defenderHealth, defenderStrength}
    console.log(`\n${attackerName} ${chalk.hex(attackerColor)('(str:' + attackerStrength + ')')} ${chalk.hex(attackerColor)('(health:' + attacker.health + ')')} vs. ${defenderName} ${chalk.hex(defenderColor)('(str:' + defenderStrength + ')')} ${chalk.hex(defenderColor)('(health:' + defender.health + ')')}`)

    while (attacker.health && defender.health) {
      const attackerRoll = d.standard()
      const attackerHit = attackerRoll > defenderStrength
      const defenderRoll = d.standard()
      const defenderHit = defenderRoll > attackerStrength

      if ((attackerHit && defenderHit) || (!attackerHit && !defenderHit)) {
        // Event: battle-round-draw
        // {attacker, attackerHealth, attackerHit, attackerRoll, attackerStrength, defender, defenderHealth, defenderHit, defenderRoll, defenderStrength}
        console.log(`${attackerName} (roll: ${attackerRoll}) and ${defenderName} (roll: ${defenderRoll}) draw no blood.`)
      } else if (attackerHit) {
        // Event: battle-round-damage
        // {attacker, attackerHealth, attackerHit, attackerRoll, attackerStrength, defender, defenderHealth, defenderHit, defenderRoll, defenderStrength}
        console.log(`${attackerName} (roll: ${attackerRoll}) ${chalk.hex('#AA0000')('wounds')} ${defenderName} (roll: ${defenderRoll}).`)
        defender.health -= 1
      } else {
        // Event: battle-round-damage
        // {attacker, attackerHealth, attackerHit, attackerRoll, attackerStrength, defender, defenderHealth, defenderHit, defenderRoll, defenderStrength}
        console.log(`${attackerName} (roll: ${attackerRoll}) ${chalk.hex('#AA0000')('wounded by')} ${defenderName} (roll: ${defenderRoll}).`)
        attacker.health -= 1
      }
    }

    // Event: battle-round-end
    // {attacker, attackerHealth, attackerHit, attackerRoll, attackerStrength, defender, defenderHealth, defenderHit, defenderRoll, defenderStrength}
    if (attacker.health <= 0) {
      console.log(`${attackerName} ${chalk.hex('#AA0000')('slain by')} ${defenderName}.`)
      attackerCasualties.push(attackers.shift())
    }
    if (defender.health <= 0) {
      console.log(`${attackerName} ${chalk.hex('#AA0000')('slays')} ${defenderName}.`)
      defenderCasualties.push(defenders.shift())
    }
  }

  console.log('\n\nBattle Results!')

  const casualtyReport = ({survivors, casualties}) => {
    console.log(`# casualties: ${casualties.length}: ${_.map(casualties, (a) => gameObjects.common.name(a)).join(', ')}`)
    console.log(`# in group remaining: ${survivors.length}: ${_.map(survivors, (a) => gameObjects.common.name(a)).join(', ')}`)
  }

  // Here attackers and defenders are the mutated copies of the group, not the original.
  empireTitle(player1.empire)
  casualtyReport({survivors: attackers, casualties: attackerCasualties})
  empireTitle(player2.empire)
  casualtyReport({survivors: defenders, casualties: defenderCasualties})

  if (attackers.length) {
    console.log(`The ${chalk.hex(player1.empire.color)(player1.empire.name)} empire wins the battle!`)
  } else if (defenders.length) {
    console.log(`The ${chalk.hex(player2.empire.color)(player2.empire.name)} empire wins the battle!`)
  } else {
    console.log("All armies are dead. This shouldn't be possible to reach.")
  }

  // Return the battle group structure + statistics.
}

if (require.main === module) {
  main()
}
