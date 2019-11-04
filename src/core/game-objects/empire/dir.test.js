import * as testModule from './'
import * as dataSourceModdables from 'data-source-moddables'

describe('game-objects.empire.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    expect(testModule.dir().length > 0).toEqual(true)
  })
})
