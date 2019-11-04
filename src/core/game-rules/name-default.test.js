import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

// Assume we'll always have this distinct type...
const TEST_NAME_VALID = 'classic'
// ...and never this one.
// const TEST_NAME_INVALID = 'fake'

describe('game-rules.name-default', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('returns expected default value when called as a getter', () => {
    expect(testMod.nameDefault()).toEqual(TEST_NAME_VALID)
  })

  it('changes the default when used as a setter', () => {
    testMod.nameDefault('hello')
    expect(testMod.nameDefault()).toEqual('hello')
  })
})
