import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

describe('game-objects.armyGroup.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    const instance = testMod.create()
    expect(typeof instance.id).toEqual('string')
    expect(Array.isArray(instance)).toEqual(true)
  })
})
