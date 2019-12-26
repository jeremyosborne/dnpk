import * as testModule from './structure'
import * as dataSourceModdables from 'data-source-moddables'

describe('strength.structure', () => {
  const structure = {
    name: 'city',
    effects: [
      {
        name: 'brawn-aura',
        magnitude: 1,
      },
    ],
  }

  beforeEach(async () => {
    // load dependencies, needed for strengthBoundary.
    await dataSourceModdables.read()
  })

  describe('strengthModifier', () => {
    it('has a default return value', () => {
      expect(testModule.strengthModifier({structure: {}})).toEqual(0)
    })

    it('works', () => {
      expect(testModule.strengthModifier({structure})).toEqual(1)
    })
  })
})
