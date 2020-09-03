import * as publicApi from './'

const TEST_TYPE = 'deity'

describe(`game-objects.${TEST_TYPE}`, () => {
  it('does not export named references to null', () => {
    Object.keys(publicApi).map((key) => expect(!!publicApi[key]).toEqual(true))
  })
})
