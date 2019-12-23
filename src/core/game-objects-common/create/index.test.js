import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'army'
const TEST_NAME_VALID = 'light-infantry'
// ...and never this one.
const TEST_NAME_INVALID = 'fake'

describe('game-objects-common.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    const instance = testMod.create(TEST_TYPE_VALID, {name: TEST_NAME_VALID})
    expect(typeof instance.id === 'string').toEqual(true)
    expect(instance.type).toEqual(TEST_TYPE_VALID)
  })

  it('throws on bad name', () => {
    expect(() => testMod.create(TEST_TYPE_VALID, {name: TEST_NAME_INVALID})).toThrow()
  })
})
