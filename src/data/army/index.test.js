const army = require('./')
const effect = require('data/effect')
const equippable = require('data/equippable')

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'light-infantry'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('army', () => {
  beforeEach(() => {
    // load dependencies...
    effect.load()
    equippable.load()
    // ...load ourselves
    army.load()
  })

  describe('.types', () => {
    it('.dir()', () => {
      expect(army.types.dir().length > 0).toEqual(true)
    })
  })

  describe('.create()', () => {
    it('breaks on bad name', () => {
      expect(() => army.create(TEST_TYPE_INVALID)).toThrow()
    })

    it('breaks with invalid data def', () => {
      // Side effect with bad data, rely on beforeEach to clean up.
      army.types.set({
        [TEST_TYPE_INVALID]: {
          // Assume this breaks the underlying schema as movement should be a number.
          movementSpeed: 'fast',
        }
      })
      expect(() => army.create(TEST_TYPE_INVALID)).toThrow()
    })
  })

  describe('functional test', () => {
    it('works', () => {
      const instance = army.create(TEST_TYPE_VALID)
      expect(typeof instance.id === 'string').toEqual(true)
    })
  })
})
