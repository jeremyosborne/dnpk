import testMod from './'

describe('game-objects-common.cosmetics', () => {
  const cosmetic1 = {name: 'color', id: '1', value: '#000000'}
  const cosmetic2 = {name: 'deed', id: '2', value: 'slayed a pop tart'}
  const cosmetic3 = {name: 'deed', id: '3', value: 'slayed a jello'}
  const cosmetic4 = {name: 'naming-proper', id: '4', value: 'jon jacob jingleheimer'}
  const cosmetic5 = {name: 'naming-title', id: '5', value: 'the schmidt, that\'s my name, too'}

  const cosmetics = [cosmetic1, cosmetic2, cosmetic3, cosmetic4, cosmetic5]

  it('works with arrays', () => {
    const cosmetics = []
    expect(testMod.has(cosmetics, cosmetic1)).toEqual(false)
    expect(testMod.hasName(cosmetics, 'color')).toEqual(false)
    testMod.add(cosmetics, cosmetic1)
    testMod.add(cosmetics, cosmetic1)
    expect(cosmetics.length).toEqual(1)
    expect(cosmetics[0].id).toEqual(cosmetic1.id)
    testMod.add(cosmetics, cosmetic2)
    expect(testMod.has(cosmetics, cosmetic1)).toEqual(true)
    expect(testMod.has(cosmetics, cosmetic2)).toEqual(true)
    expect(testMod.hasName(cosmetics, 'color')).toEqual(true)
    expect(testMod.hasName(cosmetics, 'deed')).toEqual(true)
    const removed = testMod.remove(cosmetics, cosmetic1)
    expect(cosmetics.length).toEqual(1)
    expect(removed.id).toEqual(cosmetic1.id)
    expect(testMod.has(cosmetics, cosmetic1)).toEqual(false)
    expect(testMod.has(cosmetics, cosmetic2)).toEqual(true)
    expect(!!testMod.remove(cosmetics, cosmetic1)).toEqual(false)
  })

  it('works with things that implement cosmetics', () => {
    const army = {
      cosmetics: [],
    }
    expect(testMod.has(army, cosmetic1)).toEqual(false)
    expect(testMod.hasName(army, 'color')).toEqual(false)
    testMod.add(army, cosmetic1)
    testMod.add(army, cosmetic1)
    expect(testMod.has(army, cosmetic1)).toEqual(true)
    expect(testMod.hasName(army, 'color')).toEqual(true)
    expect(army.cosmetics.length).toEqual(1)
    expect(army.cosmetics[0].id).toEqual(cosmetic1.id)
    expect(testMod.has(army, cosmetic1)).toEqual(true)
    testMod.add(army, cosmetic2)
    expect(testMod.hasName(army, 'color')).toEqual(true)
    expect(testMod.hasName(army, 'deed')).toEqual(true)
    const removed = testMod.remove(army, cosmetic1)
    expect(army.cosmetics.length).toEqual(1)
    expect(removed.id).toEqual(cosmetic1.id)
    expect(testMod.has(army, cosmetic1)).toEqual(false)
    expect(testMod.has(army, cosmetic2)).toEqual(true)
    expect(!!testMod.remove(army, cosmetic1)).toEqual(false)
  })

  describe('size', () => {
    it('works', () => {
      expect(testMod.size()).toEqual(0)
      expect(testMod.size([1, 2, 3])).toEqual(3)
      expect(testMod.size({
        cosmetics: ['a', 3, 6]
      })).toEqual(3)
    })
  })

  describe('color', () => {
    it('works', () => {
      expect(testMod.color(cosmetics)).toEqual(cosmetic1.value)
    })
  })

  describe('colors', () => {
    it('works', () => {
      expect(testMod.colors(cosmetics)).toEqual([cosmetic1.value])
    })
  })

  describe('deeds', () => {
    it('works', () => {
      expect(testMod.deeds(cosmetics)).toEqual([cosmetic2.value, cosmetic3.value])
    })
  })

  describe('naming', () => {
    describe('proper', () => {
      it('works', () => {
        expect(testMod.naming.proper(cosmetics)).toEqual(cosmetic4.value)
      })
    })

    describe('title', () => {
      it('works', () => {
        expect(testMod.naming.title(cosmetics)).toEqual(cosmetic5.value)
      })
    })

    describe('titles', () => {
      it('works', () => {
        expect(testMod.naming.titles(cosmetics)).toEqual([cosmetic5.value])
      })
    })
  })
})
