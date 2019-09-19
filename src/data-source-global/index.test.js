/**
 * @jest-environment node
 */

// Since jest "helpfully" maps window to global and vice versa, but we want to
// make sure the logic works without help, we change the jest-environment.

describe('data-source-global', () => {
  // Tests are assumed to be run from a plain node environment where `global`
  // exists.
  const WINDOW_BAK = global.window

  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    if (WINDOW_BAK) {
      global.window = WINDOW_BAK
    } else {
      delete global.window
    }
  })

  describe('exists', () => {
    it('returns false when window does not exist as expected', () => {
      global.window = undefined
      const testMod = require('./')
      expect(testMod.exists()).toEqual(false)
    })

    it('returns true when window does exist as expected', () => {
      global.window = {}
      const testMod = require('./')
      expect(testMod.exists()).toEqual(true)
    })
  })

  describe('get', () => {
    it('returns window object', () => {
      global.window = {PATH: 'a/little/something/something'}
      const testMod = require('./')
      expect(testMod.get()).toEqual(global.window)
    })
  })
})
