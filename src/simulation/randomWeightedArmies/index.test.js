import * as testMod from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

describe('randomWeightedArmies', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.read()
  })

  it('works', () => {
    expect(testMod.randomWeightedArmies().length > 0).toEqual(true)
    expect(typeof testMod.randomWeightedArmies()[0]).toEqual('string')
  })

  it("it breaks if things aren't loaded", () => {
    dataSourceGameObjects.clear()
    expect(() => testMod.randomWeightedArmies()).toThrow()
  })
})
