import * as create from "./create"
export { create }

export { createRandom } from "./create-random"
export { createRandomWeightedArmyGroup } from "./create-random-weighted-army-group"

// In general, one wants the health method alone, but the standard way of exporting
// from this module is as group of named methods.
import * as health from "./health"
export { health }

export { randomNaming } from "./random-naming"
export {
  randomWeightedArmies,
  randomWeightedArmyWeighting,
} from "./random-weighted-armies"

import * as randomTerrain from "./random-terrain"
export { randomTerrain }

// In general, one wants the strength method alone, but the standard way of exporting
// from this module is as group of named methods.
import * as strength from "./strength"
export { strength }
