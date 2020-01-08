import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

describe('random-terrain', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  describe('valueToName', () => {
    it('works', () => {
      const name = testMod.valueToName(-0.2)
      expect(name).toEqual('water')
    })
  })

  describe('create', () => {
    it('works', () => {
      const terrain = testMod.create({x: 1, y: 1})
      expect(typeof terrain.name).toEqual('string')
    })
  })
})
