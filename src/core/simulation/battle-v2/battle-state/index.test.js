import _ from 'lodash'

import * as testMod from './'

describe('battle-state', () => {
  const attackers = {
    armyGroup: {
      armies: [
        {id: '123', name: 'test attacker'}
      ]
    },
    empire: {id: 'ababab', name: 'lords of bugs'},
  }
  const defenders = {
    armyGroup: {
      armies: [
        {id: '456', name: 'test defender'}
      ]
    },
    empire: {id: 'abababcc', name: 'veggie kings'},
    // Defenders test structure and terrain mapping.
    structures: [
      {id: '1212', name: 'fort'}
    ],
    terrains: [
      {id: 'dog-dog', name: 'riverbank'}
    ]
  }
  const structures = [
    {id: '8910', name: 'mausoleum'}
  ]
  const terrains = [
    {id: '111213', name: 'marsh'}
  ]
  describe('.create() kitchen sink test', () => {
    it('works', () => {
      const state = testMod.create({attackers, defenders, structures, terrains})
      // Test cloning as well as value equality.
      expect(state.general.structures).toEqual(structures)
      expect(state.general.structures).not.toBe(structures)

      expect(state.general.terrains).toEqual(terrains)
      expect(state.general.terrains).not.toBe(terrains)

      expect(state.attackers.armyGroup).toEqual(attackers.armyGroup)
      expect(state.attackers.armyGroup).not.toBe(attackers.armyGroup)
      expect(state.attackers.armyGroupIndex).toEqual(_.keyBy(attackers.armyGroup.armies, 'id'))
      expect(state.attackers.empire).toEqual(attackers.empire)
      expect(state.attackers.empire).not.toBe(attackers.empire)
      expect(state.attackers.groupStrengthModifier).toEqual(0)
      expect(state.attackers.groupHealthModifier).toEqual(0)
      expect(state.attackers.structures).toEqual([])
      expect(state.attackers.terrains).toEqual([])
      expect(state.attackers.survivors.length).toEqual(attackers.armyGroup.armies.length)
      let battleArmy = state.attackers.survivors[0]
      // Order is preserved on create.
      expect(battleArmy.army).toEqual(attackers.armyGroup.armies[0])
      expect(battleArmy.army).not.toBe(attackers.armyGroup.armies[0])
      expect(!!state.attackers.battleArmyIndex[battleArmy.army.id]).toEqual(true)
      _.forEach([
        'strengthEffectiveBase',
        'strengthEffective',
        'strength',
        'healthEffectiveBase',
        'healthEffective',
        'health',
      ], (prop) => {
        // We want numbers not voids.
        expect(battleArmy[prop]).toEqual(0)
      })
      // nobody starts off dead
      expect(state.attackers.casualties).toEqual([])

      expect(state.defenders.armyGroup).toEqual(defenders.armyGroup)
      expect(state.defenders.armyGroup).not.toBe(defenders.armyGroup)
      expect(state.defenders.armyGroupIndex).toEqual(_.keyBy(defenders.armyGroup.armies, 'id'))
      expect(state.defenders.empire).toEqual(defenders.empire)
      expect(state.defenders.empire).not.toBe(defenders.empire)
      expect(state.defenders.groupStrengthModifier).toEqual(0)
      expect(state.defenders.groupHealthModifier).toEqual(0)
      expect(state.defenders.structures).toEqual(defenders.structures)
      expect(state.defenders.terrains).toEqual(defenders.terrains)
      expect(state.defenders.survivors.length).toEqual(defenders.armyGroup.armies.length)
      battleArmy = state.defenders.survivors[0]
      // Order is preserved on create.
      expect(battleArmy.army).toEqual(defenders.armyGroup.armies[0])
      expect(battleArmy.army).not.toBe(defenders.armyGroup.armies[0])
      expect(!!state.defenders.battleArmyIndex[battleArmy.army.id]).toEqual(true)
      _.forEach([
        'strengthEffectiveBase',
        'strengthEffective',
        'strength',
        'healthEffectiveBase',
        'healthEffective',
        'health',
      ], (prop) => {
        // We want numbers not voids.
        expect(battleArmy[prop]).toEqual(0)
      })
      // nobody starts off dead
      expect(state.defenders.casualties).toEqual([])
    })
  })
})
