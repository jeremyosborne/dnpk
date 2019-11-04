import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

// Assume we'll always have this distinct type...
const TEST_NAME_VALID = 'hero'
// ...and never this one.
const TEST_NAME_INVALID = 'fake'

describe('game-objects.effect.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    const instance = testMod.create({name: TEST_NAME_VALID})
    expect(typeof instance.id === 'string').toEqual(true)
    expect(instance.type).toEqual('effect')
  })

  it('breaks on bad name', () => {
    expect(() => testMod.create({name: TEST_NAME_INVALID})).toThrow()
  })
})
