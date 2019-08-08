# Battle Module

System definition for the battles.

## Mechanics of original game

Plain text online docs of original game: http://www.lemonamiga.com/games/docs.php?id=1752

* Initiation of combat requires 2 movement points, and can only be initiated by the player in the hot seat.
* Battles are between two groups of N number of units, where N in the original game is:
    * max 8 for a single stack not in a city.
    * max 32 for attacks on a city (cities always occupied 4 squares and all defending armies in a city participated).
    * No army is exempt from the count: a seemingly singular hero still counts as 1 towards the army limit.
    * Note: there's a nuance for attacking neutral cities where the city seems to act as one army of some strength vs. the attacking armies.
* Each army in the attacking group or defending group has it's strength calculated according to:
    * Terrain type where the battle is taking place (which corresponds to the defender's terrain), which provide a strength bonus or penalty based on:
        * Empire affiliation (Lord Bane, Gray Dwarves, etc... from the original game). From original game:

```
                             F
                       W  S  O     P  M
                    R  A  H  R  H  L  A
                    O  T  O  E  I  A  R
                    A  E  R  S  L  I  S
                    D  R  E  T  L  N  H
                  +---------------------+
SIRIANS           : .  .  .  .  .  .  . :
STORM GIANTS      : .  .  .  . +1  . -1 :
GREY DWARVES      : .  .  . -1 +2  . -1 :
ORCS OF KOR       : .  .  . -1  .  . +1 :
ELVALLIE          : .  .  . +1 -1  . -1 :
SELENTINES        : . +1 +1  .  .  .  . :
HORSE LORDS       :+1  .  . -1 -1 +1  . :
LORD BANE         : .  .  . -1  .  . +1 :
                  +---------------------+
                    . = NO EFFECT
```

        * Individual army type. From original game:

```
                 TERRAIN
                 F
                 O     M
                 R  H  A
                 E  I  R
                 S  L  S
                 T  L  H
               +---------+
GIANTS         :-1  .  . :
DWARVES        :-1 +1  . :
HEAVY INFANTRY :-1 -1 -1 :
LIGHT INFANTRY :-1 -1 -1 :
ELVEN ARCHERS  :+1 -1 -1 :
CAVALRY        :-1 -1 -1 :
WOLF-RIDERS    :-1 -1  . :
PEGASI         :+1  .  . :
GRIFFINS       : . +1  . :
UNDEAD         :-1  . +1 :
DEMONS         :-1  .  . :
DEVILS         :-1  .  . :
DRAGONS        : .  .  . :
WIZARDS        : .  .  . :
HEROES         : .  .  . :
NAVIES         : .  .  . :
               +---------+
                 . = NO EFFECT
```
    * Special units (like Wizards) provide a single bonus: if at least one special in army, +1 strength bonus to group.
        * Army that provides the `special` bonus is granted +1 strength.
    * Flying units (like Griffons) provide a single bonus: if at least one flying unit in army, +1 strength bonus to group.
        * Army that provides the `flying` bonus is granted +1 strength.
    * Heroes + their inventory, which seems to be calculated as:
        * Heroes carrying `battle items` that boost their individual strength contribute to the individual hero before calculating the leadership bonus of the hero.
            * Items in original game varied in strength between 1 and 3.
        * Heroes contribute a leadership bonus contributes to the overall army bonus as:
            * 0 to 3 = 0
            * 4 to 6 = 1
            * 7 or 8 = 2
            * 9 = 3
        * Any `command items` carried by the hero will add to the overall bonus.
            * Items in original game varied in strength between 1 and 3.
            * This appeared to be an uncapped bonus in the original game. If a hero carried a total of +7 bonus worth of command items, this would effectively make every unit in the group a 9 (maximum) strength army as no army had a base strength below 2.
    * Fortifications apply bonuses to defenders only:
        * Tower = 2
        * City defence values:
            * 0 or 1 = 0
            * 2 to 6 = 1
            * 7 or 8 = 2
            * 9 = 3
* Armies are queued from weakest strength (cannon fodder) to strongest, with the exception being heroes that are always queued last, followed by vehicles (e.g. boats) where the loss of the vehicle would mean the loss of the units anyway.
    * I remember rare situations where the hero was not queued last, but I think this is a bug and not in the spirt of the "heroes lead from the rear because... leadership bonus!"
* Each army has 2 hit points, no more no less.
* Each round of battle is decided by a d10 roll, one for each unit in the battle:
    * Attacker rolls against defender calculated strength, and vice versa.
    * A high roll is > opposing strength.
    * A low roll is <= opposing strength.
    * For a hit to be registered, one must roll high, the other must roll low.
    * Any other combination of rolls -- both high or both low -- does not result in damage on either unit.
* The fighting occurs between the heads of the queue, and proceeds until one stack is obliterated.

* Example: A natural strength 9 unit (dragon) vs. a strength 3 unit (light infantry), both units with 2 hit points
    * Every round:
        * 7/10 * 9/10 = 63% chance dragon hits (dragon high, light infantry low)
        * 3/10 * 1/10 = 3% chance light infantry hits (dragon low, light infantry high)
        * (3/10 * 9/10) + (7/10 * 1/10) = 34% miss (dragon low, light infantry low; dragon high, light infantry high)
    * Who will win?
        * Dragon = 99.4% (only 91% of the time escapes with no damage)
        * Light Infantry = 0.6%
* Example: 2 light infantry (LIa and LIb) at strength 3, both units with 2 hit points:
    * Every round:
        * 7/10 * 3/10 = 21% chance LIa hits
        * 3/10 * 7/10 = 21% chance LIb hits
        * (7/10 * 7/10) + (3/10 * 3/10) = 48% chance of a miss
    * Winner:
        * LIa = 50% (25% of the time escapes with no damage)
        * LIb = 50% (25% of the time escapes with no damage)
