import * as testModule from './structure'
import * as dataSourceModdables from 'data-source-moddables'

describe('health.structure', () => {
  const structure = {
    name: 'city',
    effects: [
      {
        name: 'constitution-aura',
        magnitude: 1,
      },
    ],
  }

  beforeEach(async () => {
    // load dependencies, needed for the someday addition of a health bonus limit.
    await dataSourceModdables.read()
  })

  describe('healthModifier', () => {
    it('has a default return value', () => {
      expect(testModule.healthModifier({structure: {}})).toEqual(0)
    })

    it('works', () => {
      expect(testModule.healthModifier({structure})).toEqual(1)
    })
  })
})
