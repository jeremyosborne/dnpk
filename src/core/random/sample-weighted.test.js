import * as testMod from './sample-weighted'

describe('random.sample-weighted', () => {
  it('returns an array of choices', () => {
    expect(testMod.sampleWeighted({choices: [1, 2]}).length).toEqual(1)
    expect(testMod.sampleWeighted({
      choices: [1, 2],
      size: 2,
    }).length).toEqual(2)
  })

  it('returns expected item by weight', () => {
    // Brittle to assuming linear scan happens internally.
    const choices = [1, 10]

    // Pick high...
    let picks = testMod.sampleWeighted({
      choices,
      weight: (o) => o,
    }, {
      randint: jest.fn(() => 11)
    })
    expect(picks[0]).toEqual(choices[1])

    // Pick low...
    picks = testMod.sampleWeighted({
      choices,
      weight: (o) => o,
    }, {
      randint: jest.fn(() => 1)
    })
    expect(picks[0]).toEqual(choices[0])
  })

  it('throws if we hit code that should be unreachable', () => {
    expect(() => testMod.sampleWeighted({
      choices: [1, 10],
      weight: (o) => o,
    }, {
      // Throw due to random number generator returning a number that is too large.
      randint: jest.fn(() => 12)
    })).toThrow()
  })
})
