import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

// Assume we'll always have this distinct type...
const TEST_NAME_VALID = 'tower'
// ...and never this one.
const TEST_NAME_INVALID = 'fake'

describe('game-objects.structure.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    const instance = testMod.create({name: TEST_NAME_VALID})
    // Terrain does not have an id, at least right now.
    // expect(typeof instance.id === 'string').toEqual(true)
    expect(instance.type).toEqual('structure')
  })

  it('breaks on bad name', () => {
    expect(() => testMod.create({name: TEST_NAME_INVALID})).toThrow()
  })
})
