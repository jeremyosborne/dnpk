import * as equippable from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'firesword'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('equippable', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  describe('.dir()', () => {
    it('works', () => {
      expect(equippable.dir().length > 0).toEqual(true)
    })
  })

  describe('.create()', () => {
    it('works', () => {
      const instance = equippable.create({name: TEST_TYPE_VALID})
      expect(typeof instance.id === 'string').toEqual(true)
    })

    it('breaks on bad name', () => {
      expect(() => equippable.create({name: TEST_TYPE_INVALID})).toThrow()
    })
  })
})
