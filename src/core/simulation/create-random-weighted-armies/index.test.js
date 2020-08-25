import * as testMod from './'
import * as dataSourceModdables from 'data-source-moddables'
import _ from 'lodash'

describe('createRandomWeightedArmies', () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works with expected defaults', () => {
    const armies = testMod.createRandomWeightedArmies()
    expect(armies.length).toEqual(8)
  })

  it('works with arguments', () => {
    const size = 30
    const armies = testMod.createRandomWeightedArmies({
      exclude: ['light-infantry'],
      size,
    })
    expect(armies.length).toEqual(size)
    // Due to random nature, we'll test over time -> infinity and assert always true
    // over many tests means the code is fine.
    expect(_.filter(armies, (a) => a.name === 'light-infantry').length).toEqual(0)
  })
})
