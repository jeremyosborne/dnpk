import * as effect from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'hero'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('effect', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  describe('.dir()', () => {
    it('works', () => {
      expect(effect.dir().length > 0).toEqual(true)
    })
  })

  describe('.create()', () => {
    it('works', () => {
      const instance = effect.create({name: TEST_TYPE_VALID})
      expect(typeof instance.id === 'string').toEqual(true)
      expect(instance.type).toEqual('effect')
    })

    it('breaks on bad name', () => {
      expect(() => effect.create({name: TEST_TYPE_INVALID})).toThrow()
    })
  })
})
