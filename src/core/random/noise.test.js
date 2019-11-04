import * as testMod from './noise'

describe('random.noise', () => {
  describe('noisePerlin', () => {
    it("doesn't blow up", () => {
      const value = testMod.noisePerlin({
        x: 0,
        y: 0,
        octaves: 3,
        persistance: 1 / 100,
      })
      expect(typeof value).toEqual('number')
      expect(Number.isNaN(value)).toEqual(false)
    })
  })
})
