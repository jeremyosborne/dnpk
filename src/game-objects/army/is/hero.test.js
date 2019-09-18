import * as testModule from './'

describe('game-objects.army.is.hero', () => {
  it('works', () => {
    expect(testModule.hero({})).toEqual(false)

    expect(testModule.hero({
      effects: [
        {name: 'hero'}
      ]
    })).toEqual(true)
  })
})
