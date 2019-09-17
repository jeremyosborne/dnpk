import * as testModule from './'

describe('army', () => {
  describe('.do', () => {
    describe('.equip()', () => {
      it('works', () => {
        const army = {
          equipment: [],
        }
        const equippable = {
          name: 'rusty sword'
        }

        testModule.equip({army, equippable})
        expect(army.equipment.length).toEqual(1)
        expect(army.equipment.indexOf(equippable) > -1).toEqual(true)
      })
    })
  })
})
