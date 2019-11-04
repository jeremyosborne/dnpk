import * as army from './'
import * as dataSourceModdables from 'data-source-moddables'

describe('game-objects.army.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    expect(army.dir().length > 0).toEqual(true)
  })
})
