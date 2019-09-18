import * as testMod from './'
import * as configGameObjects from 'config-game-objects'

describe('game-objects.rules.strengthBounded', () => {
  beforeEach(async () => {
    // load dependencies...
    await configGameObjects.load()
  })

  it('works, assuming classic rules are loaded', () => {
    expect(testMod.strengthBounded(10)).toEqual(9)
    expect(testMod.strengthBounded(5)).toEqual(5)
    expect(testMod.strengthBounded(-2)).toEqual(0)
  })
})
