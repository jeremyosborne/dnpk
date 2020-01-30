# Battle module

The battle module handles a central portion of the wargame: resolving violence between armies of different empires.

## Requirements and Constraints

* Battles are between two groups, `attackers` and `defenders`.
* Battles have one winner and one loser.
* Battles must be configurable via rule sets, allowing the user to turn on or off certain features of a battle, or configure the knobs and dials used in calculations used within the battle.
* API must support raw calculation of just the results with low overhead. Used for:
    * predictive behavior, assuming monte-carlo method
    * quick computation of battle summary where only the results are important
* API must support a system to display visual results of the turn by turn action of a battle and allow access to all data that might be needed during visualization.
* API, at a higher level, allows for callback based hooks. The callbacks will be passed the battle state, and will be allowed to modify the state of the battle as well as pass messages back into the battle flow.
* API, at a higher level, will be event based, message passing.

## Battle state data structures

### battleArmy

Each `army` in a battle will have a `battleArmy` structure associated with it. This structure is assumed to be mutable and represents all the state necessary to manage and report on the lifecycle of an individual army during a battle.

```js
{
    // Reference to the original army.
    army: object,

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
```

### battleGroup

Each `armyGroup` in a battle will have a `battleGroup` structure associated with it. This structure is assumed to be mutable and represents all the state necessary to manage and report on the lifecycle of an individual `armyGroup` throughout the lifecycle of a battle. In the current design, there will only ever be two `battleGroup`s: `attackers` and `defenders`.

```js
{
    //
    // Values that will not mutate during the course of a battle
    //
    // reference to the original armyGroup
    armyGroup: object|object[],
    // associative array, keyed by id, of all armies in the armyGroup. Values are references to original army.
    armyGroupIndex: object,
    // reference to the original empire applied to this group
    empire: object,
    // reference to original terrain applied to this group
    terrains: object[],
    // reference to original structures applied to this group
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
```

### battleState

The `battleState` represents the current state of a battle.

```js
{
    // Items that apply to attackers and defenders.
    general: {
        // reference to any general terrain applied to the battle.
        terrains: object[],
        // reference to any general structures applied to the battle.
        structures: object[],
    },
    // reference to the current state of the battle groups.
    attackers: battleGroup,
    defenders: battleGroup,
}
```

### battleRoundParticipant

The `battleRoundParticipant` provides meta-data for each army in each round of violence that happens within a round of battle.

```js
{
    // Reference to the `battleArmy` acting as this participant.
    ref: battleArmy,
    // The number rolled on the virtual dice by this participant.
    roll: number,
    // Whether or not the raw roll on the virtual dice resulted in a hit against the opponent.
    hit: boolean,
    // Whether or not the results of the round of combat resulted in damage against this unit.
    damaged: boolean,
}
```

### battleEvent

The `battleEvent` is an `event` which is itself a message envelope passed from the API to anyone listening.

```js
{
    // Constant value, will never change.
    type: 'event'
    // String with structured hierarchy delimited by colons.
    name: 'battle:*'

    // The current state of the battle.
    state: battleState,

    // Additional properties: each event will publish additional sets of properties.
    //
    // During a 'battle:round:*' event, `attacker` and `defender` properties will
    // be published and will take the form of:
    attacker: battleRoundParticipant,
    defender: battleRoundParticipant,
}
```

## Battle Procedure

* Basic data will be passed into the battle module. Much of the data is optional.
    * General objects can be associated with the battle. General objects are assumed to affect all participants in a battle. They are additive.
        * Optional: `structures` which will affect all battle participants
        * Optional: `terrains` which will affect all battle participants
    * Required: A group of armies form the `attackers`.
        * Required: the `armyGroup` participating in the battle.
            * NOTE: The battle module does not handle the merging of different `armyGroup`s during special events, e.g. a city siege.
        * Optional: can be associated with an `empire` for additional modifiers.
        * Optional: can be associated with specific `structures` for additional modifiers.
        * Optional: can be associated with specific `terrains` for additional modifiers.
    * Required: A group of armies form the `defenders`.
        * Required: the `armyGroup` participating in the battle.
            * NOTE: The battle module does not handle the merging of different `armyGroup`s during special events, e.g. a city siege.
        * Optional: can be associated with an `empire` for additional modifiers.
        * Optional: can be associated with specific `structures` for additional modifiers.
        * Optional: can be associated with specific `terrains` for additional modifiers.
* Generate temporary data structures used during the battle.
* Calculate `effective base strength` for `attackers` and `defenders`:
    * `effective base strength` represents the army's current strength based on promotions, shrine bonuses, experience, maluses, etc.
    * start with the `army.strength` value.
    * for every effect or equipment.effect of `brawn`, add sum of all modifiers.
    * for every effect or equipment.effect of `brawn-terrain-modifier` that matches any of the associated terrains - generic or specific - add sum of all modifiers.
* Calculate `effective group strength modifier` for `attackers` and `defenders`:
    * if any army with any effect or equipment.effect of `aerial` add +1.
    * if any army with any effect or equipment.effect of `elite` add +1.
    * for every army, for every effect or equipment.effect of `brawn-aura`, add sum of all modifiers.
    * for every hero, calculate a `leadership bonus` based on the `effective base strength` of the hero, add sum of all `leadership bonus`es.
    * for the empire, for every effect of `brawn-terrain-modifier` that matches any associated `terrains`, add sum of all modifiers.
    * for every associated `structures` - generic and specific - for every effect or equipment.effect of `brawn-aura`, add sum of all modifiers.
* Calculate `group strength modifier` for the `attackers` and `defenders`:
    * `group strength modifier = max(group strength modifier min, min(group strength modifier max, effective group strength modifier))`
* Calculate `effective strength` for `attackers` and `defenders`:
    * for every army, `effective strength = max(army strength min, min(army strength max, effective base strength + group strength modifier))`
* Calculate `effective base health` for `attackers` and `defenders`:
    * `effective base health` represents the army's current health based on promotions, shrine bonuses, experience, maluses, etc.
    * start with the `army.health` value.
    * for every effect or equipment.effect of `constitution`, add sum of all modifiers.
* Calculate `effective group health modifier` for `attackers` and `defenders`:
    * for every army, for every effect or equipment.effect of `constitution-aura`, add sum of all modifiers.
    * for every associated `structures` - generic and specific - for every effect or equipment.effect of `constitution-aura`, add sum of all modifiers.
* Calculate `group health modifier` for `attackers` and `defenders`:
    * `group health modifier = max(group health modifier min, min(group health modifier max, effective group group modifier))`.
* Calculate `effective health` for `attackers` and `defenders`:
    * for every army, `effective health = max(army health min, min(army health max, effective base health + group health modifier))`.
* With final values, the armies in the `battleGroups` forming the `attackers` and `defenders` are sorted based on some form of weighted sorting rules, assuming lower priority units will be at the front of the queue, higher priority units will be at the back of the queue.
* The `battle:start` event marks the end of battle precursor calculation and the beginning of individual rounds of battle.
* Each battle will loop through a set of `battle:round:*` events until the battle is complete.
    * Test: if attackers.survivors.length > 0 and defenders.survivors.length > 0, start a new round of battle, else fall through.
    * `battle:round:start`: the units at the head of each of the `survivors` queues will be engaged in battle until one is dead.
    * `battle:round:violence`: will happen until for each round, publishing battle information for each round of violence. Battle dice are rolled against the opposition strength.
        * Both rolls are >, or both rolls are lower <=: no damage.
        * One rolls >, one rolls low <=: the higher roller does damage to the opposition.
        * If damage, subtract damage from the health of the opposition.
        * If health of one participant <= 0, break, else continue.
    * `battle:round:end`: one participant of the battle is dead.
        * Battle state is updated: the dead unit is moved dequeued from the survivors and enqueued into the casualties.
        * Event is reported with an updated battle state and meta data about the ending of the battle round.
    * go back to `Test:` for battle rounds.
* The `battle:end` event marks the end of the battle. One army has one, one has been defeated.
    * Battle state is final and will receive no more updates from the battle module.
    * Battle state is reported along with any other meta data.
    * None of the original data structures passed in will be modified. It is now the job of the caller to take the battle results and apply any permanent changes to the official game state.
