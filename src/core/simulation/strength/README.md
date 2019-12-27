# Strength calculation functions

Strength can be modified up and down by a multiple factors.

9 times out of 10 you will want to do:

```js
import strength from '<package>/strength'

// Calculate strength values for a particular army, bounded within game rules.
// Pass objects that should modify the strength given a particular situation.
const armyStrength = strength({army, armyGroup, ...other})
```
