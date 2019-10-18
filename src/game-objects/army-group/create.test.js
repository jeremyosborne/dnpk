import * as testMod from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

describe('game-objects.armyGroup.create', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.read()
  })

  it('works', () => {
    const instance = testMod.create()
    expect(typeof instance.id).toEqual('string')
    expect(Array.isArray(instance)).toEqual(true)
  })
})
