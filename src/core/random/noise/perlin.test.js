import * as testMod from './perlin'

describe('random.noise.perlin', () => {
  describe('create', () => {
    it('returns a function', () => {
      const p = testMod.create()
      const value = p(1.3, 1.5)
      expect(typeof value).toEqual('number')
      expect(Number.isNaN(value)).toEqual(false)
    })
  })
})
