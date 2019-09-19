import * as configGameObjects from 'config-game-objects'
import _ from 'lodash'

import * as testModule from './strength-modifier'

describe('game-objects.army-group.strength-modifier', () => {
  // Hero by itself should supply +1
  // Equipment with command modifier should add +1
  // total: +2
  const armyHero = {
    name: 'hero',
    strength: 4,
    effects: [
      {name: 'hero'}
    ],
    equipment: [
      {effects: [{name: 'command', magnitude: 1}]}
    ]
  }
  const armyGroup = [
    armyHero,
    // Doesn't matter where the effect is, should equal +2.
    {name: 'dragon', effects: [{name: 'elite'}, {name: 'aerial'}]},
    // This should not contribute anything since the effects are one time applications.
    {name: 'dragon', effects: [{name: 'elite'}, {name: 'aerial'}]},
  ]

  beforeEach(async () => {
    // load dependencies, needed for rules for strength boundary when calculating
    // hero effective strength.
    await configGameObjects.load()
  })

  describe('strengthModifierHero', () => {
    it('handles various hero strength < 4', () => {
      const testHero = _.cloneDeep(armyHero)
      testHero.strength = 3
      expect(testModule.strengthModifierHero({armyGroup: [testHero]})).toEqual(0)
      testHero.strength = 4
      expect(testModule.strengthModifierHero({armyGroup: [testHero]})).toEqual(1)
      testHero.strength = 7
      expect(testModule.strengthModifierHero({armyGroup: [testHero]})).toEqual(2)
      testHero.strength = 9
      expect(testModule.strengthModifierHero({armyGroup: [testHero]})).toEqual(3)
    })
  })

  describe('strengthModifier', () => {
    it('works', () => {
      expect(testModule.strengthModifier({armyGroup})).toEqual(4)
    })

    it('handles empty groups', () => {
      expect(testModule.strengthModifier({armyGroup: []})).toEqual(0)
    })
  })
})
