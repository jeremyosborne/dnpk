import * as testMod from './size'

describe('size', () => {
  it('works', () => {
    expect(testMod.size()).toEqual(0)
    expect(testMod.size([1, 2, 3])).toEqual(3)
    expect(testMod.size({
      armies: ['a', 3, 6]
    })).toEqual(3)
  })
})
