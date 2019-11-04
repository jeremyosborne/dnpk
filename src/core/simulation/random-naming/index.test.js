import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

// Assume we'll always have this distinct type...
const TEST_NAME_VALID = 'hero'
// ...and never this one.
const TEST_NAME_INVALID = 'fake'

describe('randomNaming', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    const instance = testMod.randomNaming({name: TEST_NAME_VALID})
    expect(typeof instance === 'string').toEqual(true)
  })

  it('breaks on bad name', () => {
    expect(() => testMod.randomNaming({name: TEST_NAME_INVALID})).toThrow()
  })
})
