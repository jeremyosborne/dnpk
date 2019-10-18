import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

describe('randomWeightedArmies', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    expect(testMod.randomWeightedArmies().length > 0).toEqual(true)
    expect(typeof testMod.randomWeightedArmies()[0]).toEqual('string')
  })

  it("it breaks if things aren't loaded", () => {
    dataSourceModdables.clear()
    expect(() => testMod.randomWeightedArmies()).toThrow()
  })
})
