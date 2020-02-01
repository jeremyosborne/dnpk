import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'

// Factory method for initializing a battle army.
// New structure built around army, original army structure not mutated, but will be referenced.
export const battleArmy = {
  create: (army) => {
    return {
      army,
      // Init here only, as calculations can have weird interdependencies based on
      // other objects we don't have access to.
      strengthEffectiveBase: 0,
      strengthEffective: 0,
      strength: 0,

      healthEffectiveBase: 0,
      healthEffective: 0,
      health: 0,
    }
  }
}

// Factory method for initializing a battle group.
// Mutates what is passed in, make sure to pass in a copy of the original battleGroup.
export const battleGroup = {
  create: (group) => {
    // By definition, we have some required values.
    // group.armyGroup = group.armyGroup
    group.armyGroupIndex = _.keyBy(gameObjectsCommon.armies.get(group.armyGroup), 'id')
    // group.empire = group.empire
    group.groupStrengthModifier = group.groupStrengthModifier || 0
    group.groupHealthModifier = group.groupStrengthModifier || 0

    group.structures = group.structures || []
    group.terrains = group.terrains || []

    // All armies are assumed survivors to start with.
    // Sorted later after effective strength and health values determined.
    group.survivors = group.survivors || _.map(gameObjectsCommon.armies.get(group.armyGroup), battleArmy.create)
    group.casualties = group.casualties || []

    group.battleArmyIndex = _.keyBy(group.survivors, 'army.id')

    return group
  },
}

// Factory method for initializing the entire battle state.
// Performs defensive copying of input and does not mutate what is passed in.
export const create = ({
  attackers,
  defenders,
  structures,
  terrains,
}) => {
  return {
    general: {
      structures: structures ? _.cloneDeep(structures) : [],
      terrains: structures ? _.cloneDeep(terrains) : [],
    },
    attackers: battleGroup.create(_.cloneDeep(attackers)),
    defenders: battleGroup.create(_.cloneDeep(defenders)),
  }
}

export default create
