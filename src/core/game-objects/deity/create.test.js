import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

const TEST_TYPE = 'deity'
// Assume we'll always have this distinct type...
const TEST_NAME_VALID = 'dragur'
// ...and never this one.
const TEST_NAME_INVALID = 'fake'

describe(`game-objects.${TEST_TYPE}.create`, () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    const instance = testMod.create({name: TEST_NAME_VALID})
    expect(typeof instance.metadata.createdAt).toEqual('string')
    expect(typeof instance.id).toEqual('string')
    expect(instance.type).toEqual(TEST_TYPE)
  })

  it('breaks on bad name', () => {
    expect(() => testMod.create({name: TEST_NAME_INVALID})).toThrow()
  })
})
