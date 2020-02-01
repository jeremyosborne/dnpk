import * as gameObjectsCommon from 'game-objects-common'
import _ from 'lodash'

//
// Each `army` in a battle will have a `battleArmy` structure associated with it. This structure
// is assumed to be mutable and represents all the state necessary to manage and report on the
// lifecycle of an individual army during a battle.
//
// Factory method for initializing a battle army.
// New structure built around army, original army structure not mutated, but will be referenced.
//
export const battleArmy = {
  create: (army) => {
    return {
      // Reference to clone of original armu.
      army,

      // Following values are initialized to numbers, and calculations are performed later.

      // The effective base strength of the army, per the definition of calculation. Once calculated, value is immutable for life of battle.
      strengthEffectiveBase: 0,
      // The effective base strength + group battle strength modifier. Once calculated, value is immutable for life of battle.
      strengthEffective: 0,
      // Current effective strength of the army. This value is mutable, and reflects any strength modifications taken _during_ the battle at the time of reference.
      strength: 0,

      // The effective base health of the army, per the definition of the calculation. Once calculated, value is immutable for life of battle.
      healthEffectiveBase: 0,
      // The effective base strength + effective group battle health modifier. Once calculated, value is immutable for life of battle.
      healthEffective: 0,
      // Current effective health of the army. This value is mutable, and reflects any health modifications  taken _during_ the battle.
      health: 0,
    }
  }
}

//
// Each `armyGroup` in a battle will have a `battleGroup` structure associated
// with it. This structure is assumed to be mutable and represents all the
// state necessary to manage and report on the lifecycle of an individual
// `armyGroup` throughout the lifecycle of a battle. In the current design,
// there will only ever be two `battleGroup`s: `attackers` and `defenders`.
//
// Factory method for initializing a battle group.
// Mutates what is passed in, make sure to pass in a copy of the original battleGroup.
//
export const battleGroup = {
  create: (group) => {
    // Reference to arguments passed in already available on group. Read only during battle.
    // group.armyGroup = group.armyGroup

    // `id` lookup to original `army` objects. Read only during battle.
    group.armyGroupIndex = _.keyBy(gameObjectsCommon.armies.get(group.armyGroup), 'id')

    // Already referenced in original group object. Read only during battle.
    // group.empire = group.empire

    // The calculated group strength modifier. Once calculated, this will remain read only and available as a reference.
    group.groupStrengthModifier = group.groupStrengthModifier || 0
    // The calculated group health modifier. Once calculated, this will remain read only and available as a reference.
    group.groupHealthModifier = group.groupHealthModifier || 0

    // Optional, enforce as array. Read only during life of battle.
    group.structures = group.structures || []
    // Optional, enforce as array. Read only during life of battle.
    group.terrains = group.terrains || []

    // All armies are assumed survivors to start with.
    // survivors is a `battleArmy[]`.
    // survivors and all battleArmies are mutable.
    // Strength calculations and priority sorting are determined later.
    group.survivors = group.survivors || _.map(gameObjectsCommon.armies.get(group.armyGroup), battleArmy.create)
    // casualties is a `battleArmy[]`. queue of armies that have died. Mutable.
    group.casualties = group.casualties || []

    // `id` lookup to `battleArmy` objects. Object is immutable (although underlying battleArmy objects will change).
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
    // Objects that are assumed to provide affects to all parties in the battle.
    general: {
      // Structures affecting all groups.
      structures: structures ? _.cloneDeep(structures) : [],
      // Terrain effecting all groups.
      terrains: structures ? _.cloneDeep(terrains) : [],
    },
    // The bullies.
    attackers: battleGroup.create(_.cloneDeep(attackers)),
    // The bullied.
    defenders: battleGroup.create(_.cloneDeep(defenders)),
  }
}

export default create
