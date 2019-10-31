import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

// Assume we'll always have this distinct type...
const TEST_TYPE_VALID = 'army'
const TEST_NAME_VALID = 'hero'
// ...and never this one.
const TEST_TYPE_INVALID = 'fake'

describe('simulation.createRandom()', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    const instance = testMod.createRandom({name: TEST_NAME_VALID, type: TEST_TYPE_VALID})
    expect(typeof instance.id).toEqual('string')
    expect(instance.type).toEqual('army')
  })

  it('breaks on bad name', () => {
    expect(() => testMod.createRandom({name: TEST_NAME_VALID, type: TEST_TYPE_INVALID})).toThrow()
  })

  it("it breaks if things aren't loaded", () => {
    dataSourceModdables.clear()
    expect(() => testMod.createRandom()).toThrow()
  })
})
