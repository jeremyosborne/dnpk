import * as terrain from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

describe('game-objects.terrain.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.load()
  })

  it('works', () => {
    expect(terrain.dir().length > 0).toEqual(true)
  })
})
