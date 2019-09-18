import * as testModule from './'
import * as configGameObjects from 'config-game-objects'

describe('game-objects.army-group.strength-modifier', () => {
  beforeEach(async () => {
    // load dependencies, needed for rules for strength boundary.
    await configGameObjects.load()
  })

  it('works', () => {
    // Minimal test.
    const armyGroup = [
      // Hero by itself should supply +1
      // Equipment with command modifier should add +1
      // total: +2
      {
        name: 'hero',
        strength: 4,
        effects: [
          {name: 'hero'}
        ],
        equipment: [
          {effects: [{name: 'command', magnitude: 1}]}
        ]
      },
      // Doesn't matter where the effect is, should equal +2.
      {name: 'dragon', effects: [{name: 'elite'}, {name: 'aerial'}]},
      // This should not contribute anything since the effects are one time applications.
      {name: 'dragon', effects: [{name: 'elite'}, {name: 'aerial'}]},
    ]

    expect(testModule.strengthModifier(armyGroup)).toEqual(4)
  })

  it('handles empty groups', () => {
    expect(testModule.strengthModifier([])).toEqual(0)
  })
})
