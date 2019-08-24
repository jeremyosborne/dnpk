const effect = require('data/effect')
const equippable = require('./')

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'firesword'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('equippable', () => {
  beforeEach(() => {
    // load our dependencies
    effect.load()
    // ...load ourselves
    equippable.load()
  })

  describe('.types', () => {
    it('.dir()', () => {
      expect(equippable.types.dir().length > 0).toEqual(true)
    })
  })

  describe('.create()', () => {
    it('breaks on bad name', () => {
      expect(() => equippable.create(TEST_TYPE_INVALID)).toThrow()
    })

    it('breaks with invalid data def', () => {
      // Side effect with bad data, rely on beforeEach to clean up.
      equippable.types.set({
        [TEST_TYPE_INVALID]: {
          // Assume this breaks the underlying schema as this should be an array.
          effects: 'lots of them',
        }
      })
      expect(() => equippable.create(TEST_TYPE_INVALID)).toThrow()
    })
  })

  describe('functional test', () => {
    it('works', () => {
      const instance = equippable.create(TEST_TYPE_VALID)
      expect(typeof instance.id === 'string').toEqual(true)
    })
  })
})
