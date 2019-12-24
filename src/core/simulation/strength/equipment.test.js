import * as testModule from './equipment'
import * as dataSourceModdables from 'data-source-moddables'

describe('strength.equipment', () => {
  const equipment = [
    {
      name: 'sword of testing',
      effects: [
        {name: 'brawn', magnitude: 4},
        {name: 'brawn', magnitude: -2},
        {name: 'brawn-aura', magnitude: 1},
      ]
    }
  ]

  beforeEach(async () => {
    // load dependencies, needed for strengthBoundary.
    await dataSourceModdables.read()
  })

  describe('strengthModifierBrawn', () => {
    it('works', () => {
      // 4 - 2 + 0 + (ignores the brawn-aura effect) = 2
      expect(testModule.strengthModifierBrawn({equipment})).toEqual(2)
    })
  })

  describe('strengthModifierStrengthModifierAura', () => {
    it('works', () => {
      // (0 ignores brawn) + 1 = 1
      expect(testModule.strengthModifierBrawnAura({equipment})).toEqual(1)
    })
  })
})
