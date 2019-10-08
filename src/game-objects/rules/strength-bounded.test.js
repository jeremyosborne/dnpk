import * as testMod from './'
import * as dataSourceGameObjects from 'data-source-game-objects'

describe('game-objects.rules.strengthBounded', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceGameObjects.read()
  })

  it('plays nice with nulls to prevent NaNs', () => {
    // albeit maybe it shouldn't.
    expect(testMod.strengthBounded()).toEqual(0)
  })

  it('works, assuming classic rules are loaded', () => {
    expect(testMod.strengthBounded(10)).toEqual(9)
    expect(testMod.strengthBounded(5)).toEqual(5)
    expect(testMod.strengthBounded(-2)).toEqual(0)
  })

  it('has classic defaults if rules are not loaded', () => {
    dataSourceGameObjects.clear()
    expect(testMod.strengthBounded(10)).toEqual(9)
    expect(testMod.strengthBounded(5)).toEqual(5)
    expect(testMod.strengthBounded(-2)).toEqual(0)
  })
})
