import * as testMod from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

// Assume we'll always have this distinct type...
const TEST_NAME_VALID = 'hero'
// ...and never this one.
const TEST_NAME_INVALID = 'fake'

describe('game-objects.naming.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.read()
  })

  it('works', () => {
    const instance = testMod.create({name: TEST_NAME_VALID})
    expect(typeof instance === 'string').toEqual(true)
  })

  it('breaks on bad name', () => {
    expect(() => testMod.create({name: TEST_NAME_INVALID})).toThrow()
  })
})
