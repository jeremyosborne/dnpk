import * as testMod from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

describe('game-objects.rules.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.load()
  })

  it('works', () => {
    expect(testMod.dir().length > 0).toEqual(true)
  })
})
