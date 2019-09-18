import * as configGameObjects from 'config-game-objects'
import * as testModule from './'

describe('game-objects.terrain.strength-modifier', () => {
  const army = {
    name: 'test dummy',
    strength: 3,
    effects: [
      {
        name: 'terrain-battle-modifier',
        magnitude: -1,
        metadata: {
          name: 'forest'
        }
      },
    ]
  }
  const terrain = {name: 'forest'}
  const empire = {
    effects: [
      {
        name: 'terrain-battle-modifier',
        magnitude: 1,
        metadata: {
          name: 'forest'
        }
      },
    ]
  }

  beforeEach(async () => {
    // load dependencies, needed for strengthBoundary.
    await configGameObjects.load()
  })

  it('has a default return', () => {
    // Terrain needs association, right now no terrain modifiers strength by itself.
    // This could eventually change.
    expect(testModule.strengthModifier({terrain})).toEqual(0)
  })

  it('works with terrain and army', () => {
    expect(testModule.strengthModifier({army, terrain})).toEqual(-1)
  })

  it('works with terrain and empire', () => {
    expect(testModule.strengthModifier({empire, terrain})).toEqual(1)
  })

  it('works with army and empire and terrain', () => {
    expect(testModule.strengthModifier({army, empire, terrain})).toEqual(0)
  })
})
