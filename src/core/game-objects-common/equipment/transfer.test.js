import * as testMod from './transfer'

describe('game-objects-common.equpiment.transfer', () => {
  let object
  let from
  let to
  // For future transfer to general code.
  const objectListKey = 'equipment'

  beforeEach(() => {
    object = {id: '1', name: 'sword of doom'}
    from = {id: '2', [objectListKey]: [object]}
    to = {id: '3', [objectListKey]: []}
  })

  it('works with objects for object', () => {
    testMod.transfer(object, from, to)
    expect(from[objectListKey].length).toEqual(0)
    expect(to[objectListKey].length).toEqual(1)
    expect(to[objectListKey][0].id === object.id).toEqual(true)
  })

  it('works with a string for object', () => {
    testMod.transfer(object.id, from, to)
    expect(from[objectListKey].length).toEqual(0)
    expect(to[objectListKey].length).toEqual(1)
    expect(to[objectListKey][0].id === object.id).toEqual(true)
  })

  it('works even if from and to are native arrays', () => {
    const from = [object]
    const to = []
    testMod.transfer(object.id, from, to)
    expect(from.length).toEqual(0)
    expect(to.length).toEqual(1)
    expect(to[0].id === object.id).toEqual(true)
  })
})
