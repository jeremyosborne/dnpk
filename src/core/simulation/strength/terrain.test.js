import * as testModule from './terrain'
import * as dataSourceModdables from 'data-source-moddables'
import _ from 'lodash'

describe('strength.terrain', () => {
  const army = {
    name: 'test dummy',
    strength: 3,
    effects: [
      {
        name: 'terrain-modifier-brawn',
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
        name: 'terrain-modifier-brawn',
        magnitude: 1,
        metadata: {
          name: 'forest'
        }
      },
    ]
  }

  beforeEach(async () => {
    // load dependencies, needed for strengthBoundary.
    await dataSourceModdables.read()
  })

  describe('strengthModifierTerrainEmpire', () => {
    it('logs oddities', () => {
      const logger = jest.fn()
      const oddEmpire = _.cloneDeep(empire)
      delete oddEmpire.effects[0].magnitude
      testModule.strengthModifierTerrainEmpire({empire: oddEmpire, terrain}, {logger})
      expect(logger.mock.calls.length > 0).toEqual(true)
    })

    it('filters correctly on terrain name', () => {
      expect(testModule.strengthModifierTerrainEmpire({empire, terrain: {name: 'the office'}})).toEqual(0)
    })
  })

  describe('strengthModifierTerrainArmy', () => {
    it('logs oddities', () => {
      const logger = jest.fn()
      const oddArmy = _.cloneDeep(army)
      delete oddArmy.effects[0].magnitude
      testModule.strengthModifierTerrainArmy({army: oddArmy, terrain}, {logger})
      expect(logger.mock.calls.length > 0).toEqual(true)
    })
  })

  describe('strengthModifier', () => {
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
})
