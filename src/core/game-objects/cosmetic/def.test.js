import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

// Assume we'll always have this distinct type...
const TEST_NAME_VALID = 'color'
// ...and never this one.
const TEST_NAME_INVALID = 'fake'

describe('game-objects.cosmetic.def', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    // Explicit named reference.
    expect(!!testMod.def(TEST_NAME_VALID)).toEqual(true)
    expect(!!testMod.def(TEST_NAME_INVALID)).toEqual(false)

    // Associative array return.
    expect(!!testMod.def()[TEST_NAME_VALID]).toEqual(true)
    expect(!!testMod.def()[TEST_NAME_INVALID]).toEqual(false)
  })
})
