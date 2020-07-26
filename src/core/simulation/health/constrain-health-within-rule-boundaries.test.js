import * as testMod from './constrain-health-within-rule-boundaries'
import * as dataSourceModdables from 'data-source-moddables'

describe('health.constrainHealthWithinRuleBoundaries', () => {
  describe('unit tests', () => {
    let configOverride

    beforeEach(async () => {
      configOverride = {
        logger: jest.fn(),
        max: () => 6,
        maxDefault: 5,
        min: () => -2,
        minDefault: -1,
      }
    })

    it('plays nice with undefined to prevent NaNs, albeit maybe it should not', () => {
      expect(testMod.constrainHealthWithinRuleBoundaries(undefined, configOverride)).toEqual(0)
    })

    it('limited by min and max config functions, which are generally hooked up to the game rules', () => {
      expect(testMod.constrainHealthWithinRuleBoundaries(10001, configOverride)).toEqual(6)
      expect(testMod.constrainHealthWithinRuleBoundaries(5, configOverride)).toEqual(5)
      expect(testMod.constrainHealthWithinRuleBoundaries(-10001, configOverride)).toEqual(-2)
    })

    it('limited by maxDefault when max, and likely game-rules, are not numbers', () => {
      configOverride.max = jest.fn(() => 'hi')
      expect(testMod.constrainHealthWithinRuleBoundaries(Infinity, configOverride)).toEqual(5)
      expect(configOverride.max.mock.calls.length).toBe(1)
      expect(configOverride.logger.mock.calls.length).toBe(1)
    })

    it('limited by minDefault when min, and likely game-rules, are not numbers', () => {
      configOverride.min = jest.fn(() => 'hi')
      expect(testMod.constrainHealthWithinRuleBoundaries(-Infinity, configOverride)).toEqual(-1)
      expect(configOverride.min.mock.calls.length).toBe(1)
      expect(configOverride.logger.mock.calls.length).toBe(1)
    })

    it('errors if min is greater than max, likely due to bad rules, and is likely an error that should never reach this function', () => {
      configOverride.max = jest.fn(() => 0)
      configOverride.min = jest.fn(() => 10)
      expect(() => testMod.constrainHealthWithinRuleBoundaries(-Infinity, configOverride)).toThrow()
    })
  })

  describe('integration tests', () => {
    beforeEach(async () => {
      // load dependencies...
      await dataSourceModdables.read()
    })

    it('plays nice with undefined to prevent NaNs, albeit maybe it should not', () => {
      expect(testMod.constrainHealthWithinRuleBoundaries()).toEqual(1)
    })

    it('works, assuming classic rules are loaded', () => {
      expect(testMod.constrainHealthWithinRuleBoundaries(10001)).toEqual(4)
      expect(testMod.constrainHealthWithinRuleBoundaries(3)).toEqual(3)
      expect(testMod.constrainHealthWithinRuleBoundaries(-10001)).toEqual(1)
    })

    it('has classic limits if rules are not loaded', () => {
      dataSourceModdables.clear()
      expect(testMod.constrainHealthWithinRuleBoundaries(Infinity)).toEqual(testMod.MAX_DEFAULT)
      expect(testMod.constrainHealthWithinRuleBoundaries(3)).toEqual(3)
      expect(testMod.constrainHealthWithinRuleBoundaries(-Infinity)).toEqual(testMod.MIN_DEFAULT)
    })
  })
})
