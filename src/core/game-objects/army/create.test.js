import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

// Assume we'll always have this distinct type...
const TEST_NAME_VALID = 'light-infantry'
// ...and never this one.
const TEST_NAME_INVALID = 'fake'

describe('game-objects.army.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    const instance = testMod.create({name: TEST_NAME_VALID})
    expect(typeof instance.metadata.createdAt).toEqual('string')
    expect(typeof instance.id).toEqual('string')
    expect(instance.type).toEqual('army')
  })

  it('throws on bad name', () => {
    expect(() => testMod.create({name: TEST_NAME_INVALID})).toThrow()
  })

  describe('sanity test with underlying schema validator', () => {
    it('does not reuse metadata default object instances', () => {
      // One of these tests should be enough, placed here since army gets revisited regularly over time.
      const instance1 = testMod.create({name: TEST_NAME_VALID})
      const instance2 = testMod.create({name: TEST_NAME_VALID})
      instance1.metadata.someTestValue = 'in the beginning'
      expect(instance1.metadata.someTestValue).not.toEqual(instance2.metadata.someTestValue)
    })
  })
})
