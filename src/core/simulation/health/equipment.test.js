import * as testModule from './equipment'
import * as dataSourceModdables from 'data-source-moddables'

describe('health.equipment', () => {
  const equipment = [
    {
      name: 'sword of testing',
      effects: [
        {name: 'constitution', magnitude: 4},
        {name: 'constitution', magnitude: -2},
        {name: 'constitution-aura', magnitude: 1},
      ]
    }
  ]

  beforeEach(async () => {
    // load dependencies, needed for boundaries if we add them someday.
    await dataSourceModdables.read()
  })

  describe('healthModifierConstitution', () => {
    it('works', () => {
      // 4 - 2 + 0 + (ignores the constitution-aura effect) = 2
      expect(testModule.healthModifierConstitution({equipment})).toEqual(2)
    })
  })

  describe('healthModifierConstitutionAura', () => {
    it('works', () => {
      // (0 ignores constitution) + 1 = 1
      expect(testModule.healthModifierConstitutionAura({equipment})).toEqual(1)
    })
  })
})
