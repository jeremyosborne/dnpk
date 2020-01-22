import * as testModule from './army-group'
import * as dataSourceModdables from 'data-source-moddables'

describe('health.army-group', () => {
  // Equipment with constitution-aura should add +1
  // Heroes, by default, do not add extra health.
  const armyHero = {
    name: 'hero',
    health: 2,
    effects: [
      {name: 'hero'}
    ],
    equipment: [
      {effects: [{name: 'constitution-aura', magnitude: 1}]}
    ]
  }
  const armies = [
    armyHero,
    {name: 'cleric', effects: [{name: 'constitution-aura', magnitude: 1}]},
    // This should not attribute normal constitution
    {name: 'beefy dude', effects: [{name: 'constitution', magnitude: 1}]},
  ]
  const armyGroup = {
    armies,
  }

  beforeEach(async () => {
    // load dependencies in case we add boundaries to health bonuses, someday.
    await dataSourceModdables.read()
  })

  describe('healthModifierEquippableConstitutionAura', () => {
    it('does not explode', () => {
      expect(testModule.healthModifierEquippableConstitutionAura()).toEqual(0)
    })

    it('handles a magnitude null constitution-aura object', () => {
      const armyHero = {
        name: 'hero',
        health: 2,
        effects: [
          {name: 'hero'}
        ],
        equipment: [
          {effects: [{name: 'constitution-aura'}]}
        ]
      }
      const armies = [armyHero]
      const armyGroup = {armies}

      // No NaN.
      expect(testModule.healthModifierEquippableConstitutionAura({armyGroup})).toEqual(0)
      expect(testModule.healthModifierEquippableConstitutionAura({armyGroup: armies})).toEqual(0)
    })
  })

  describe('healthModifier', () => {
    it('works', () => {
      expect(testModule.healthModifier({armyGroup})).toEqual(2)
    })

    it('handles empty groups', () => {
      expect(testModule.healthModifier({armyGroup: []})).toEqual(0)
    })

    it('does not explode', () => {
      expect(testModule.healthModifier()).toEqual(0)
    })
  })
})
