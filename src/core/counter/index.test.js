import * as testMod from './'

describe('counter', () => {
  describe('functional test', () => {
    it('works as expected', () => {
      const counter = testMod.create()
      expect(counter.exists('dog')).toEqual(false)
      counter('dog')
      expect(counter.get('dog')).toEqual(1)
      counter.add('dog')
      expect(counter.get('dog')).toEqual(2)
      counter.add('dog', -2)
      expect(counter.exists('dog')).toEqual(true)
      expect(counter.get('dog')).toEqual(0)
      counter.add('dog', 5)
      counter.set('dog', 3)
      expect(counter.get('dog')).toEqual(3)
      counter.del('dog')
      expect(counter.get('dog')).toEqual(0)
      counter.add('cat', -1)
      expect(counter.get('cat')).toEqual(-1)

      // Setup to make sure that default cache is not accidentally shared.
      counter.add('dog')
      expect(counter.get('dog')).toEqual(1)

      const counter2 = testMod.create()
      expect(counter2.get('dog')).toEqual(0)
    })
  })

  describe('add', () => {
    it('works with different settings', () => {
      const counter = testMod.create()
      counter('hello') // +1
      counter('world') // +1
      counter(['hello', 'world', 'world']) // +1 each
      expect(counter.get('hello')).toEqual(2)
      expect(counter.get('world')).toEqual(3)

      counter('hello', 5) // +5
      expect(counter.get('hello')).toEqual(7)
      counter(['hello', 'world'], 5) // +5 each
      expect(counter.get('hello')).toEqual(12)
      expect(counter.get('world')).toEqual(8)
    })
  })

  describe('clear', () => {
    it('works', () => {
      const counter = testMod.create()
      counter('a')
      counter('b')
      expect(counter.get('a')).toEqual(1)
      counter.clear()
      expect(counter.get('a')).toEqual(0)
    })
  })

  describe('sorted', () => {
    it('organizes', () => {
      const counter = testMod.create()
      counter('dog')
      counter.set('wiener dog', 10)
      counter('cat', 2)
      counter.set('gryphon', -2)
      expect(counter.sorted()).toEqual([
        {label: 'wiener dog', value: 10},
        {label: 'cat', value: 2},
        {label: 'dog', value: 1},
        {label: 'gryphon', value: -2},
      ])
    })
  })

  describe('sum', () => {
    it('does maths', () => {
      const counter = testMod.create()
      counter('dog')
      counter('cat', 2)
      counter.set('gryphon', -2)
      expect(counter.sum()).toEqual(1)
    })
  })

  describe('toJSON', () => {
    const cache = {a: 42}
    const counter = testMod.create(cache)
    // By definition of ECMAScript toJSON, returns the objec to be serialized.
    expect(counter.toJSON()).toEqual(cache)
  })
})
