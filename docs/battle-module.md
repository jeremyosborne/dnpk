# Battle Module

System definition for the battles.

## Mechanics of original game

Plain text online docs of original game: http://www.lemonamiga.com/games/docs.php?id=1752

* Initiation of combat requires 2 movement points, and can only be initiated by the player in the hot seat.
* Battles are between two groups of N number of units, where N in the original game is 8. No army is exempt from the count: a seemingly singular hero still counts as 1 towards the army limit.
    * There's a nuance with the battle between an army and a neutral city of N strength that I forget the specifics of...
    * ...and also cities, which should be abstracted at fortifications in this code. Cities in the original game could contain 4 stacks of 8 armies each, or up to 32 units. Any defender in a city would be pulled into the battle initiated by the attacker.
* Each army in the overall stack has it's strength calculated according to:
    * Empire affiliation (Lord Bane, Gray Dwarves, etc... from the original game)
    * Terrain of the defending unit (plus or minus)
    * Special units (like Wizards)
    * Flying units (like Griffons)
    * Heroes (their leadership based on strength)
    * Artifacts carried by the hero (can modify the hero strength or provide an aura "leadership" bonus, or both)
    * Fortifications (city or tower bonus applied to defenders)
* Armies are queued from weakest strength (cannon fodder) to strongest, and in most situations the hero or heroes are always queued last.
    * I remember rare situations where the hero was not queued last, but I think this is a bug and not in the spirt of the "heroes lead from the rear because... leadership bonus!"
* Each army has 2 hit points, no more no less.
* Each round of battle is decided by a d10 roll, one for each unit in the battle:
    * Attacker rolls against defender calculated strength, and vice versa.
    * A high roll is > opposing strength.
    * A low roll is <= opposing strength.
    * For a hit to be registered, one must roll high, the other must roll low.
    * Any other combination of rolls -- both high or both low -- does not result in damage on either unit.
* The fighting occurs between the heads of the queue, and proceeds until one stack is obliterated.
