const defs = require('./')

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'hero'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('effect', () => {
  beforeEach(() => {
    // Reset, in case it is necessary.
    defs.types.set()
  })

  describe('.types', () => {
    it('.dir()', () => {
      expect(defs.types.dir().length).toEqual(0)
    })
  })

  describe('.create()', () => {
    it('breaks on bad name', () => {
      expect(() => defs.create(TEST_TYPE_INVALID)).toThrow()
    })

    it('breaks with invalid data def', () => {
      // Side effect with bad data, rely on beforeEach to clean up.
      defs.types.set({
        [TEST_TYPE_INVALID]: {
          // Assume this breaks the underlying schema as this should be a number.
          duration: 'fast',
        }
      })
      expect(() => defs.create(TEST_TYPE_INVALID)).toThrow()
    })
  })

  describe('functional test', () => {
    it('works', () => {
      const instance = defs.create(TEST_TYPE_VALID)
      expect(typeof instance.id === 'string').toEqual(true)
    })
  })
})
