import * as terrain from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'road'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('effect', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  describe('.dir()', () => {
    it('works', () => {
      expect(terrain.dir().length > 0).toEqual(true)
    })
  })

  describe('.create()', () => {
    it('works', () => {
      const instance = terrain.create({name: TEST_TYPE_VALID})
      // Terrain does not have an id, at least right now.
      // expect(typeof instance.id === 'string').toEqual(true)
      expect(instance.type).toEqual('terrain')
    })

    it('breaks on bad name', () => {
      expect(() => terrain.create({name: TEST_TYPE_INVALID})).toThrow()
    })
  })
})
