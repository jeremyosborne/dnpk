import * as configGameObjects from 'config-game-objects'
import chalk from 'chalk'
import * as gameObjects from 'game-objects'
import {init as l10nInit, t} from 'l10n'
import _ from 'lodash'
import {d} from 'random'
import {sprintf} from 'sprintf-js'

const showGroup = (group, color) => {
  const strengthModifier = gameObjects.army.group.strengthModifier(group)
  console.log(`${chalk[color](t('Army group bonus: {{bonus}}', {bonus: strengthModifier}))}`)
  console.log(`${chalk[color](group.reduce((info, army) => {
    const strength = gameObjects.army.strength(army)
    info.push(`${sprintf('%-17s', gameObjects.name(army))} ${sprintf('Str: %-3s', army.strength)} (Eff Str: ${strength}) (Battle Str: ${Math.min(9, strength + strengthModifier)})`)
    return info
  }, []).join('\n'))}`)
}

// mutates object passed in
const heroEquipRandom = (a, color = 'green') => {
  const eq = gameObjects.equippable.create.random()
  console.log(chalk[color](`Equipping ${gameObjects.name(a)} with ${gameObjects.name(eq)}`))
  gameObjects.army.do.equip(a, eq)

  return a
}

const empireTitle = (empire) => console.log(chalk[empire.color](t('{{empire.name}}', {empire})))

// int main(void)
export const main = async () => {
  await l10nInit()
  await configGameObjects.load()

  console.log(t('Battle prototype'))

  const armyTypes = gameObjects.army.dir()
  console.log(t('Armies available:'))
  console.log(chalk.yellow(_.sortBy(armyTypes).join('\n')))

  // Create 2 groups of armies.

  console.log('')
  const dadEmpire = {
    color: 'blue',
    name: 'Dad the Dictator',
  }
  const dadGroup = _.times(8, gameObjects.army.create.random)
  empireTitle(dadEmpire)
  // Equip heroes with items.
  _.filter(dadGroup, gameObjects.army.is.hero)
    .forEach((a) => heroEquipRandom(a, 'blue'))
  showGroup(dadGroup, 'blue')

  console.log('')

  const archerEmpire = {
    color: 'red',
    name: 'Archer the Awesome',
  }
  const archerGroup = _.times(8, gameObjects.army.create.random)
  empireTitle(archerEmpire)
  // Equip heroes with items.
  _.filter(archerGroup, gameObjects.army.is.hero)
    .forEach((a) => heroEquipRandom(a, 'red'))
  showGroup(archerGroup, 'red')

  // Engage the 2 groups in battle.

  // Clone the attacking and defending groups. Battle can mutate the objects, but reports/events
  // out the results. The caller is responsible for handling the results of the
  // battle and applying permanent changes. Ideally this allows for a later rules
  // extensions where battle "kills" can be translated to "downed" or "injured"
  // or "captured" or "routed" units.
  const attackers = gameObjects.army.group.sort(_.cloneDeep(dadGroup))

  // Create the defending group battle structure.
  const defenders = gameObjects.army.group.sort(_.cloneDeep(archerGroup))

  console.log('\n\n\nBattle commencing between\n')

  // Who is fighting who.
  empireTitle(dadEmpire)
  showGroup(attackers, 'blue')
  console.log('vs.')
  empireTitle(archerEmpire)
  showGroup(defenders, 'red')

  // While both groups still have units, keep going.
  const attackerCasualties = []
  const defenderCasualties = []
  while (attackers.length && defenders.length) {
    // Top of the stack current battle.
    const attacker = attackers[0]
    const attackerStrength = Math.min(9, gameObjects.army.group.strengthModifier(attackers) + gameObjects.army.strength(attacker))
    const defender = defenders[0]
    const defenderStrength = Math.min(9, gameObjects.army.group.strengthModifier(defenders) + gameObjects.army.strength(defender))

    console.log(`${gameObjects.name(attacker)} (${attackerStrength}) vs. ${gameObjects.name(defender)} (${defenderStrength})`)

    const attackerHit = d(10) < defenderStrength
    const defenderHit = d(10) < attackerStrength
    // console.log('attackerHit: %s, defenderHit: %s', attackerHit, defenderHit)

    if ((attackerHit && defenderHit) || (!attackerHit && !defenderHit)) {
      console.log(`${gameObjects.name(attacker)} and ${gameObjects.name(defender)} draw no blood.`)
    } else if (attackerHit) {
      console.log(`${gameObjects.name(attacker)} hits and wounds ${gameObjects.name(defender)}.`)
      defender.health -= 1
    } else {
      console.log(`${gameObjects.name(defender)} hits and wounds ${gameObjects.name(attacker)}.`)
      attacker.health -= 1
    }

    if (attacker.health <= 0) {
      console.log(`${gameObjects.name(attacker)} is slain.`)
      // TODO: Handle casualties.
      attackerCasualties.push(attackers.shift())
    }
    if (defender.health <= 0) {
      console.log(`${gameObjects.name(defender)} is slain.`)
      // TODO: Handle casualties.
      defenderCasualties.push(defenders.shift())
    }
  }

  // Here attackers and defenders are the mutated copies of the group, not the original.
  console.log('# attacker casualties:', attackerCasualties.length)
  console.log('# attacker group remaining:', attackers.length)
  console.log('# defender casualties:', defenderCasualties.length)
  console.log('# defender group remaining:', defenders.length)

  if (attackers.length) {
    console.log(`${dadEmpire.name} wins the battle!`)
  }
  if (defenders.length) {
    console.log(`${archerEmpire.name} wins the battle!`)
  }

  // Return the battle group structure + statistics.
}

if (require.main === module) {
  main()
}
