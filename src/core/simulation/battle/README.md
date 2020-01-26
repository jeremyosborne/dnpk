# Battle module

```js
// battleArmy
{
    // Reference to the original army
    id: string,

    // the effective base strength of the army, per the definition of calculation. Value is immutable.
    strengthEffectiveBase: number,
    // effective base strength + group battle strength modifier. Value is immutable.
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

// battleGroup
{
    //
    // Values that will not mutate during the course of a battle
    //
    // reference to the original armyGroup
    armyGroup: object|object[],
    // associative array, keyed by id, of all armies in the armyGroup. Values are references to original army.
    armyGroupIndex: object,
    // reference to the original empire
    empire: object,
    // reference to the original, specific terrain applied to this group
    terrain: object,
    // reference to the original array of structures applied to this group
    structures: object[],

    // the group strength modifier (final calculated and bounded number) applied to this group
    groupStrengthModifier: number,
    // the group health modifier (final calculated and bounded number)
    groupHealthModifier: number,

    // associative array, keyed by id, of all armies translated into battle-army structures.
    competitorsIndex: battleArmy{},

    //
    // Values that will mutate over the course of a battle
    //
    // reference to array of battle-army objects that have not yet been killed during battle
    survivors: battleArmy[],
    // reference to array of battle-army objects that have killed during battle
    casualties: battleArmy[],
}

TODO: continue from here

// battle-meta
{
    // Items that apply to attackers and defenders.
    general: {
        terrain: object, // reference to any general terrain applied to the battle
    },
    // Information
    attackers: battleGroup,
    defenders: battleGroup,
}

// battle-violence-competitor
{
    id: string,
    roll: number,
    hit: boolean,
    damaged: boolean,
}
// battle-violence-round
{
    attacker: battleViolenceCompetitor,
    defender: battleViolenceCompetitor,
}
```

## Battle Procedure

* A group of armies form the `attackers`.
    * can be associated with an `empire` for additional modifiers.
    * can be associated with a `structure` for additional modifiers.
    * can be associated with a specific `terrain` for additional modifiers.
* A group of armies form the `defenders`.
    * can be associated with an `empire` for additional modifiers.
    * can be associated with a `structure` for additional modifiers.
    * can be associated with a specific `terrain` for additional modifiers.
* Optional: a general `terrain` can be associated with the battle. General `terrain` affects both `attackers` and `defenders` and effects are cumulative with the individual terrain.
* calculate `effective base strength` for `attackers` and `defenders`:
    * `effective base strength` represents the army's current strength based on promotions, shrine bonuses, experience, maluses, etc.
    * start with the `army.strength` value
    * for every effect or equipment.effect of `brawn`, add sum of all modifiers
    * for every effect or equipment.effect of `brawn-terrain-modifier` that matches any of the associated terrain, add sum of all modifiers
* calculate `effective group strength modifier` for `attackers` and `defenders`:
    * if any army with any effect or equipment.effect of `aerial` add +1
    * if any army with any effect or equipment.effect of `elite` add +1
    * for every army, for every effect or equipment.effect of `brawn-aura`, add sum of all modifiers
    * for every hero, calculate a `leadership bonus` based on the `effective base strength` of the hero, add sum of all `leadership bonus`es
    * for the empire, for every effect of `brawn-terrain-modifier` that matches any of the associated terrain, add sum of all modifiers
    * for every structure, for every effect or equipment.effect of `brawn-aura`, add sum of all modifiers
* calculate `group strength modifier` for the `attackers` and `defenders`:
    * `group strength modifier = max(group strength modifier min, min(group strength modifier max, effective group strength modifier))`
* calculate `effective strength` for `attackers` and `defenders`:
    * for every army, `effective strength = max(army strength min, min(army strength max, effective base strength + group strength modifier))`
* calculate `effective base health` for `attackers` and `defenders`:
    * `effective base health` represents the army's current health based on promotions, shrine bonuses, experience, maluses, etc.
    * start with the `army.health` value
    * for every effect or equipment.effect of `constitution`, add sum of all modifiers
* calculate `effective group health modifier` for `attackers` and `defenders`:
    * for every army, for every effect or equipment.effect of `constitution-aura`, add sum of all modifiers
    * for every structure, for every effect or equipment.effect of `constitution-aura`, add sum of all modifiers
* calculate `group health modifier` for `attackers` and `defenders`:
    * `group health modifier = max(group health modifier min, min(group health modifier max, effective group group modifier))`
* calculate `effective health` for `attackers` and `defenders`:
    * for every army, `effective health = max(army health min, min(army health max, effective base health + group health modifier))`
