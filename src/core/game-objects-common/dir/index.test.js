import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'army'
const TEST_NAME_VALID = 'light-infantry'

describe('game-objects-common.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    const names = testMod.dir(TEST_TYPE_VALID)
    expect(names.indexOf(TEST_NAME_VALID) > -1).toEqual(true)
  })
})
