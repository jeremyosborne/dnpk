import * as testMod from './'
import * as configGameObjects from 'config-game-objects'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'classic'
// ...and never this one.
// const TEST_TYPE_INVALID = 'fake'

describe('game-objects.rules.name-default', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  it('returns expected default value', () => {
    expect(testMod.nameDefault()).toEqual(TEST_TYPE_VALID)
  })
})
