import * as testMod from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'lord-bane'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('game-objects.empire.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.read()
  })

  it('works', () => {
    const instance = testMod.create({name: TEST_TYPE_VALID})
    expect(typeof instance.id === 'string').toEqual(true)
    expect(instance.type).toEqual('empire')
  })

  it('breaks on bad name', () => {
    expect(() => testMod.create({name: TEST_TYPE_INVALID})).toThrow()
  })
})
