const effect = require('./')

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'hero'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('effect', () => {
  beforeEach(() => {
    // we don't have other data dependencies
    effect.load()
  })

  describe('.types', () => {
    it('.dir()', () => {
      expect(effect.types.dir().length > 0).toEqual(true)
    })
  })

  describe('.create()', () => {
    it('breaks on bad name', () => {
      expect(() => effect.create(TEST_TYPE_INVALID)).toThrow()
    })

    it('breaks with invalid data def', () => {
      // Side effect with bad data, rely on beforeEach to clean up.
      effect.types.set({
        [TEST_TYPE_INVALID]: {
          // Assume this breaks the underlying schema as this should be a number.
          duration: 'fast',
        }
      })
      expect(() => effect.create(TEST_TYPE_INVALID)).toThrow()
    })
  })

  describe('functional test', () => {
    it('works', () => {
      const instance = effect.create(TEST_TYPE_VALID)
      expect(typeof instance.id === 'string').toEqual(true)
    })
  })
})
