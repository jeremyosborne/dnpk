import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

describe('game-objects.structure.dir', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    expect(testMod.dir().length > 0).toEqual(true)
  })
})
