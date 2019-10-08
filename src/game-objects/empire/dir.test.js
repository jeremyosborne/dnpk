import * as testModule from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

describe('game-objects.empire.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.load()
  })

  it('works', () => {
    expect(testModule.dir().length > 0).toEqual(true)
  })
})
