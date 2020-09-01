import * as testModule from './effects'
import * as dataSourceModdables from 'data-source-moddables'

describe('strength.effects', () => {
  const effects = [
    {name: 'brawn', magnitude: 4},
    {name: 'brawn', magnitude: -2},
    {name: 'brawn', magnitude: null}, // should never happen, but shouldn't cause an explosion.
    {name: 'brawn-aura', magnitude: 1},
    {name: 'brawn-aura', magnitude: null}, // should never happen, but shouldn't cause an explosion.
    {name: 'hero', magnitude: 1},
    {name: 'hero', magnitude: null},
  ]

  beforeEach(async () => {
    // load dependencies, needed for strengthBoundary.
    await dataSourceModdables.read()
  })

  describe('strengthModifierBrawn', () => {
    it('works', () => {
      // 4 - 2 + 0 + (ignores the brawn-aura and hero effects) = 2
      expect(testModule.strengthModifierBrawn({effects})).toEqual(2)
    })
  })

  describe('strengthModifierBrawnAura', () => {
    it('works', () => {
      // (ignores the brawn and hero effects) + 1 + 0 = 1
      expect(testModule.strengthModifierBrawnAura({effects})).toEqual(1)
    })
  })

  describe('strengthModifierHero', () => {
    it('works', () => {
      // (ignores the brawn and brawn aura effects) + 1 + 0 = 1
      expect(testModule.strengthModifierHero({effects})).toEqual(1)
    })
  })
})
