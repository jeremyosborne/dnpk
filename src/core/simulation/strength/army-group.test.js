import * as testModule from './army-group'
import * as dataSourceModdables from 'data-source-moddables'
import _ from 'lodash'

describe('strength.army-group', () => {
  // Hero by itself should supply +1
  // Equipment with brawn-aura should add +1
  // total: +2
  const armyHero = {
    name: 'hero',
    strength: 4,
    effects: [
      {name: 'hero', magnitude: 1}
    ],
    equipment: [
      {effects: [{name: 'brawn-aura', magnitude: 1}]}
    ]
  }
  const armies = [
    armyHero,
    // Doesn't matter where the effect is, should equal +2.
    {name: 'dragon', effects: [{name: 'elite'}, {name: 'aerial'}]},
    // This should not contribute anything since the effects are one time applications.
    {name: 'dragon', effects: [{name: 'elite'}, {name: 'aerial'}]},
    // Something that doesn't yet exist but could.
    {name: 'brawny guy', effects: [{name: 'brawn-aura', magnitude: 1}]}
  ]
  const armyGroup = {
    armies,
  }

  beforeEach(async () => {
    // load dependencies, needed for rules for strength boundary when calculating
    // hero effective strength.
    await dataSourceModdables.read()
  })

  describe('strengthModifierAerial', () => {
    it('does not explode', () => {
      expect(testModule.strengthModifierAerial()).toEqual(0)
    })
  })

  describe('strengthModifierElite', () => {
    it('does not explode', () => {
      expect(testModule.strengthModifierElite()).toEqual(0)
    })
  })

  describe('strengthModifierHero', () => {
    it('handles hero', () => {
      const testHero = _.cloneDeep(armyHero)
      const armies = [testHero]
      const armyGroup = {armies}
      expect(testModule.strengthModifierHero({armyGroup: armies})).toEqual(1)
      expect(testModule.strengthModifierHero({armyGroup})).toEqual(1)
    })

    it('does not explode', () => {
      expect(testModule.strengthModifierHero()).toEqual(0)
    })
  })

  describe('strengthModifierEffectsBrawnAura', () => {
    it('does not explode', () => {
      expect(testModule.strengthModifierEffectsBrawnAura()).toEqual(0)
    })

    it('handles a magnitude null brawn-aura object', () => {
      const armyHero = {
        name: 'hero',
        strength: 4,
        effects: [
          {name: 'hero'},
          {name: 'brawn-aura'}
        ]
      }
      const armies = [armyHero]
      const armyGroup = {armies}

      // No NaN.
      expect(testModule.strengthModifierEquippableBrawnAura({armyGroup})).toEqual(0)
      expect(testModule.strengthModifierEquippableBrawnAura({armyGroup: armies})).toEqual(0)
    })
  })

  describe('strengthModifierEquippableBrawnAura', () => {
    it('does not explode', () => {
      expect(testModule.strengthModifierEquippableBrawnAura()).toEqual(0)
    })

    it('handles a magnitude null brawn-aura object', () => {
      const armyHero = {
        name: 'hero',
        strength: 4,
        effects: [
          {name: 'hero', magnitude: 1}
        ],
        equipment: [
          {effects: [{name: 'brawn-aura'}]}
        ]
      }
      const armies = [armyHero]
      const armyGroup = {armies}

      // No NaN.
      expect(testModule.strengthModifierEquippableBrawnAura({armyGroup})).toEqual(0)
      expect(testModule.strengthModifierEquippableBrawnAura({armyGroup: armies})).toEqual(0)
    })
  })

  describe('strengthModifier', () => {
    it('works', () => {
      expect(testModule.strengthModifier({armyGroup})).toEqual(5)
    })

    it('handles empty groups', () => {
      expect(testModule.strengthModifier({armyGroup: []})).toEqual(0)
    })

    it('does not explode', () => {
      expect(testModule.strengthModifier()).toEqual(0)
    })
  })
})
