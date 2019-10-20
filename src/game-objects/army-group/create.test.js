import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

describe('game-objects.armyGroup.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    const instance = testMod.create()
    expect(Array.isArray(instance)).toEqual(true)
    expect(typeof instance.id).toEqual('string')
    expect(instance.type).toEqual('army-group')
  })
})
