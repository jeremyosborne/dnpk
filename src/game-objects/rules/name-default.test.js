import * as testMod from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'classic'
// ...and never this one.
// const TEST_TYPE_INVALID = 'fake'

describe('game-objects.rules.name-default', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.load()
  })

  it('returns expected default value when called as a getter', () => {
    expect(testMod.nameDefault()).toEqual(TEST_TYPE_VALID)
  })

  it('changes the default when used as a setter', () => {
    testMod.nameDefault('hello')
    expect(testMod.nameDefault()).toEqual('hello')
  })
})
