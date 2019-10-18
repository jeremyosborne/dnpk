import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'

describe('game-objects.rules.strengthBounded', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
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
    dataSourceModdables.clear()
    expect(testMod.strengthBounded(10)).toEqual(9)
    expect(testMod.strengthBounded(5)).toEqual(5)
    expect(testMod.strengthBounded(-2)).toEqual(0)
  })
})
