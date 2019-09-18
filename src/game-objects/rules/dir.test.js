import * as testMod from './'
import * as configGameObjects from 'config-game-objects'

describe('game-objects.rules.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  it('works', () => {
    expect(testMod.dir().length > 0).toEqual(true)
  })
})
