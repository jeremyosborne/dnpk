import * as testMod from './random'
import * as dataSourceGameObjects from 'data-source-game-objects'

describe('army.random', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.read()
  })

  describe('.random()', () => {
    it('works', () => {
      expect(testMod.random().length > 0).toEqual(true)
      expect(typeof testMod.random()[0]).toEqual('string')
    })

    it("it breaks if things aren't loaded", () => {
      dataSourceGameObjects.clear()
      expect(() => testMod.random()).toThrow()
    })
  })

  describe('.weighted()', () => {
    it('works', () => {
      expect(testMod.weighted().length > 0).toEqual(true)
      expect(typeof testMod.weighted()[0]).toEqual('string')
    })

    it("it breaks if things aren't loaded", () => {
      dataSourceGameObjects.clear()
      expect(() => testMod.weighted()).toThrow()
    })
  })
})
