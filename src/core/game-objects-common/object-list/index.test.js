import * as testMod from './'

describe('game-objects.common.object-list', () => {
  const effect1 = {name: 'random', id: 'effect1'}
  const effect2 = {name: 'blah', id: 'effect2'}
  const attrPath = 'dongles'
  const api = testMod.create({attrPath})

  it('works with arrays', () => {
    const effects = []
    expect(api.has(effects, effect1)).toEqual(false)
    expect(api.hasName(effects, 'random')).toEqual(false)
    api.add(effects, effect1)
    api.add(effects, effect1)
    expect(api.get(effects).length).toEqual(1)
    expect(api.get(effects, 0).id).toEqual(effect1.id)
    api.add(effects, effect2)
    expect(api.has(effects, effect1)).toEqual(true)
    expect(api.has(effects, effect2)).toEqual(true)
    expect(api.hasName(effects, 'random')).toEqual(true)
    expect(api.hasName(effects, 'blah')).toEqual(true)
    const removed = api.remove(effects, effect1)
    expect(api.get(effects).length).toEqual(1)
    expect(removed.id).toEqual(effect1.id)
    expect(api.has(effects, effect1)).toEqual(false)
    expect(api.has(effects, effect2)).toEqual(true)
    expect(!!api.remove(effects, effect1)).toEqual(false)
  })

  it('works with things that implement objects', () => {
    const army = {
      [attrPath]: [],
    }
    expect(api.has(army, effect1)).toEqual(false)
    expect(api.hasName(army, 'random')).toEqual(false)
    api.add(army, effect1)
    api.add(army, effect1)
    expect(api.has(army, effect1)).toEqual(true)
    expect(api.hasName(army, 'random')).toEqual(true)
    expect(api.get(army).length).toEqual(1)
    expect(api.get(army, 0).id).toEqual(effect1.id)
    expect(api.has(army, effect1)).toEqual(true)
    api.add(army, effect2)
    expect(api.hasName(army, 'random')).toEqual(true)
    expect(api.hasName(army, 'blah')).toEqual(true)
    const removed = api.remove(army, effect1)
    expect(api.get(army).length).toEqual(1)
    expect(removed.id).toEqual(effect1.id)
    expect(api.has(army, effect1)).toEqual(false)
    expect(api.has(army, effect2)).toEqual(true)
    expect(!!api.remove(army, effect1)).toEqual(false)
  })

  describe('size', () => {
    it('works', () => {
      expect(api.size()).toEqual(0)
      expect(api.size([1, 2, 3])).toEqual(3)
      expect(api.size({
        [attrPath]: ['a', 3, 6]
      })).toEqual(3)
    })
  })
})
