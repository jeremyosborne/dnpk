import * as testModule from './effects'
import * as dataSourceModdables from 'data-source-moddables'

describe('strength.effects', () => {
  beforeEach(async () => {
    // load dependencies, needed for strengthBoundary.
    await dataSourceModdables.read()
  })

  describe('strengthModifierBrawn', () => {
    const effects = [
      {name: 'brawn', magnitude: 4},
      {name: 'brawn', magnitude: -2},
      {name: 'brawn', magnitude: null}, // should never happen, but shouldn't cause an explosion.
      {name: 'brawn-aura', magnitude: 1},
    ]

    it('works', () => {
      // 4 - 2 + 0 + (ignores the brawn-aura effect) = 2
      expect(testModule.strengthModifierBrawn({effects})).toEqual(2)
    })
  })
})
