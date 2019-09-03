import * as empire from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'lord-bane'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('empire', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  describe('.dir()', () => {
    it('works', () => {
      expect(empire.dir().length > 0).toEqual(true)
    })
  })

  describe('.create()', () => {
    it('works', () => {
      const instance = empire.create({name: TEST_TYPE_VALID})
      expect(typeof instance.id === 'string').toEqual(true)
      expect(instance.type).toEqual('empire')
    })

    it('breaks on bad name', () => {
      expect(() => empire.create({name: TEST_TYPE_INVALID})).toThrow()
    })
  })
})
