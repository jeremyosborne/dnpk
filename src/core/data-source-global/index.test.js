import * as testMod from './'

describe('data-source-global', () => {
  describe('exists', () => {
    it('should always return true', () => {
      expect(testMod.exists()).toEqual(true)
    })
  })

  describe('get', () => {
    it('returns global', () => {
      // This assumes we're in node.
      expect(testMod.get()).toEqual(global)
    })
  })
})
