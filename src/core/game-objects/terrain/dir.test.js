import * as terrain from './'
import * as dataSourceModdables from 'data-source-moddables'

describe('game-objects.terrain.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    expect(terrain.dir().length > 0).toEqual(true)
  })
})
