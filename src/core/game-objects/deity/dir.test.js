import * as testModule from './'
import * as dataSourceModdables from 'data-source-moddables'

const TEST_TYPE = 'deity'

describe(`game-objects.${TEST_TYPE}.dir`, () => {
  beforeEach(async () => {
    // load dependencies...
    await dataSourceModdables.read()
  })

  it('works', () => {
    expect(testModule.dir().length > 0).toEqual(true)
  })
})
