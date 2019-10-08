import * as army from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

describe('game-objects.army.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.load()
  })

  it('works', () => {
    expect(army.dir().length > 0).toEqual(true)
  })
})
