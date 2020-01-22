import * as testModule from './effects'
import * as dataSourceModdables from 'data-source-moddables'

describe('health.effects', () => {
  const effects = [
    {name: 'constitution', magnitude: 4},
    {name: 'constitution', magnitude: -2},
    {name: 'constitution', magnitude: null}, // should never happen, but shouldn't cause an explosion.
    {name: 'constitution-aura', magnitude: 1},
    {name: 'constitution-aura', magnitude: null}, // should never happen, but shouldn't cause an explosion.
  ]

  beforeEach(async () => {
    // load dependencies, in case we enforce boundaries someday
    await dataSourceModdables.read()
  })

  describe('healthModifierConstitution', () => {
    it('works', () => {
      // 4 - 2 + 0 + (ignores the constitution-aura effect) = 2
      expect(testModule.healthModifierConstitution({effects})).toEqual(2)
    })
  })

  describe('healthModifierConstitutionAura', () => {
    it('works', () => {
      // (ignores the constitution effects) + 1 + 0 = 1
      expect(testModule.healthModifierConstitutionAura({effects})).toEqual(1)
    })
  })
})
