import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

describe('game-objects.armyGroup.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    const instance = testMod.create()
    expect(Array.isArray(instance.armies)).toEqual(true)
    expect(typeof instance.id).toEqual('string')
    expect(instance.type).toEqual('army-group')
  })

  it('works with default data', () => {
    const armies = [{name: 'soldier'}]
    const instance = testMod.create({armies})
    // Make sure container is cloned.
    expect(instance.armies !== armies).toEqual(true)
    expect(instance.armies[0].name).toEqual('soldier')
    expect(typeof instance.id).toEqual('string')
    expect(instance.type).toEqual('army-group')
  })
})
