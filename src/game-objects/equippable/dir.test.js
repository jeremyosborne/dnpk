import * as testModule from './'
import * as configGameObjects from 'config-game-objects'

describe('game-objects.equippable.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  it('works', () => {
    expect(testModule.dir().length > 0).toEqual(true)
  })
})
