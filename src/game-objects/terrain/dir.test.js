import * as terrain from './'
import * as configGameObjects from 'config-game-objects'

describe('game-objects.terrain.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  it('works', () => {
    expect(terrain.dir().length > 0).toEqual(true)
  })
})
