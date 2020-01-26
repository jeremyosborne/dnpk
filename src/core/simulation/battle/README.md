# Battle module

```js
// Battle structure

// battle-meta
{
    global: {

    },
    attackers: {

    },
    defenders: {

    },
}

// battle-army
{
    // Reference to the original army
    id: string,

    // the effective base strength of the army, per the definition of calculation. Value is immutable.
    strengthEffectiveBase: number,
    // effective base strength + effective group battle strength modifier. Value is immutable.
    strengthEffective: number,
    // Current effective strength of the army. This value is mutable, and reflects any strength modifications
    // taken _during_ the battle.
    strength: number,

    // The effective base health of the army, per the definition of the calculation. Value is immutable.
    healthEffectiveBase: number,
    // effective base strength + effective group battle health modifier. Value is immutable.
    healthEffective: number,
    // Current effective strength of the army. This value is mutable, and reflects any strength modifications
    // taken _during_ the battle.
    health: number,
}
```

## Battle Procedure

* A group of armies form the `attackers`.
    * can be associated with an `empire` for additional modifiers.
    * can be associated with a `structure` for additional modifiers.
    * can be associated with `terrain` for additional modifiers.
* A group of armies form the `defenders`.
    * can be associated with an `empire` for additional modifiers.
    * can be associated with a `structure` for additional modifiers.
    * can be associated with `terrain` for additional modifiers.
* A type of `terrain` is applied to the battle. General `terrain` affects both `attackers` and `defenders` if the `attackers` or `defenders` do not have their own terrain specified.
* calculate `effective base strength` for all `attackers` and `defenders` armies:
    * `effective base strength` represents the army's current strength based on promotions, shrine bonuses, experience, maluses, etc.
    * `effective base strength` is not capped by the `unit strength modifier max` during this calculation and its value, even when greater from the non-modified `base strength` of the `army` type.
    * start with the `army.strength` value
    * add modifiers from `brawn` effects on any equipment carried by the army
    * add modifiers from `brawn` effects on the army
    * add modifiers from `brawn-terrain-modifier` effects on the army
* with the `effective base strength` of each army calculated, `attackers` and `defenders` have their `effective group battle strength modifier` calculated.
    * an aerial army within the army-group will contribute a one time +1 to the `effective group battle strength modifier`.
    * an elite army within the army-group will contribute a one time +1 to the `effective group battle strength modifier`.
    * any unit with any brawn-aura effects will contribute all of the modifiers of the brawn-auras to the `effective group battle strength modifier`.
    * any unit with any equipment with any brawn-aura effects will contribute all of the modifiers of the brawn-auras to the `effective group battle strength modifier`.
    * any hero in the army will contribute a leadership bonus based on their `effective base strength`
    * any brawn-terrain-modifier provided by the `empire` effects + associated `terrain` will be applied to the `effective group battle strength modifier`.
    * any associated `structures` with `brawn-aura` effects will contribute all of their modifiers to the `effective group battle strength modifier`.
    * If the rule set applies any value for `unit strength modifier max` >= 0, this value will cap the total available `effective group battle strength modifier`.
* with the `effective base strength` and `effective group battle strength modifier`, this is applied to the respective individual armies, and calculates the `effective strength` of the unit.
    * Math.max(`effective base strength` + `effective group battle strength modifier`, `unit strength max`)
* `attackers` and `defenders` have individual army `effective base health` calculated
    * `effective base health` is not capped.
    * equipment with `constitution` modifiers are added to the `effective base health`.
    * effects with `constitution` modifiers are added to the `effective base health`.
