import * as army from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'light-infantry'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('army', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  describe('.create()', () => {
    it('works', () => {
      const instance = army.create({name: TEST_TYPE_VALID})
      expect(typeof instance.id === 'string').toEqual(true)
      expect(instance.type).toEqual('army')
    })

    it('breaks on bad name', () => {
      expect(() => army.create({name: TEST_TYPE_INVALID})).toThrow()
    })
  })
})
