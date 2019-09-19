import * as testMod from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'road'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('game-objects.terrain.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  it('works', () => {
    const instance = testMod.create({name: TEST_TYPE_VALID})
    // Terrain does not have an id, at least right now.
    // expect(typeof instance.id === 'string').toEqual(true)
    expect(instance.type).toEqual('terrain')
  })

  it('breaks on bad name', () => {
    expect(() => testMod.create({name: TEST_TYPE_INVALID})).toThrow()
  })

  describe('.random()', () => {
    it('works', () => {
      expect(testMod.create.random().type).toEqual('terrain')
    })
  })
})
