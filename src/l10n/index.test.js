import * as testMod from './'

describe('l10n', () => {
  describe('init', () => {
    it('does not explode', () => {
      return expect(testMod.init()).resolves.toEqual(undefined)
    })
  })
})
