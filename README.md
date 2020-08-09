# Dark nights of the plague king

A wargame inspired by the original [Warlords game by SSG](https://en.wikipedia.org/wiki/Warlords_(1990_video_game)) and what I always wanted to see as available in a modern version of that game.

## Runtime configuration options

Modules that make use of runtime configuration settings should list those within their module docs under the `## Runtime configuration options` heading.

### Global configuration settings and options

* `DEBUG=dnpk/*`: optionally set to show all logging messages specific to this application.
* `NODE_PATH=src/core`: MUST be applied to the environment of all executables (app, tests, etc.) using this application or modules within this application to allow a "local module" style of importing vs. the horrendously brittle `../../../` relative path reference to other modules.
    * `NODE_PATH=src/core:src/testing-grounds`: MUST be supplied when running the developer focused `testing-grounds` test app.

## TODO

General guidelines for the new year: After revisiting warlords and warlords 2, those games and the community around them are still quite solid (and playable on modern hardware). No need to truly recreate the original (my favorite), but rather create a successor to the game that I never had and that the sequels didn't fulfill for me.

- [ ] Improve the battle module
    - [ ] Allow the battle module to be run as a generator.
        - [ ] Can be run in event mode which yields events on every significant event.
        - [ ] Can be run in non-event mode which only yields on the completion of the battle.
    - [ ] Have the battle module have a fight iteration maximum like at X number of rolls / turns the armies retreat exhausted?
    - [ ] Add the new health code to the battle code rewrite.
- [ ] Add a `cosmetics` array that works like effects, but for display only purposes.
    - [ ] D&D style "races": elven light infantry, human light infantry; human archers and elvish archers.
    - [ ] when building an army in the classic game each one got `Xth troop of type Y of city Z` which adds some flavor for troops that last a long time, and some sobering effect as you get up to `306th light infantry that will likely immediately die` from your home city.
    - [ ] change `gameObjectsCommon.name` to something else, like `displayName`. It's too easily confused with the `name` property.
    - [ ] objects should have a cosmetic identifier of `game time created` stored as... turn number? Integer meaning something something?
    - [ ] Flags of cities and towers change as troops pass them / control them.
- [ ] Other structures for classic parity
    - [ ] Ruins / Temples
        - [ ] Searchable by: Heroes (according to original rules)
        - [ ] Guarded: Possibly.
        - [ ] Grants: Items, special armies that will ally to your cause (and originally the only way to get special allies like demons, dragons, etc.), or possibly both.
        - [ ] States: Explored, Unexplored
    - [ ] Shrines
        - [ ] Searchable by: All
        - [ ] Guarded: No.
        - [ ] Grants: A 1 time brawn bonus to any armies searching.
        - [ ] States: Always available, but each army only achieve the blessing from a specific shrine one time.
    - [ ] Sage / Library
        - [ ] Searchable by: All
        - [ ] Guarded: no.
        - [ ] Grants: Knowledge (location of heroes, items).
        - [ ] States: Always available.
- [ ] Economy
    - [ ] Add production base costs
    - [ ] Add upkeep and upkeep management
- [ ] Data integrity tool that checks `data-sources` for correctness as well as idiomatic things we enforce.

## Ideas

- [ ] Heroes have mounts. Mounts are `equippables` that can supply an individual move bonus or modification, or an army-group wide move bonus or modification.
- [ ] Synergies between units to create more bonuses.
- [ ] Move core code out into a shared, more reusable code base.
- [ ] Mid battle reinforcements.
- [ ] Original games had "vectoring". Is reinforcing/reinforcements the same thing? Something different?
- [ ] Special troops that spawn or break apart into other troops.
- [ ] Production "vectoring" as they called it in the original game. The "magically teleporting your troops to another city" is a lot of what made the original warlords so fun and not a drudgery to play.
- [ ] Fog of war, although original game had no fog of war.
- [ ] New structure: Special and specific god shrines (distinct from the general blessing shrines)
    - [ ] Every god grants rewards for actions. Maybe one god wants you to kill X number of troops, one god wants X number of your troops to die, one god wants you to build X number of troops, one god wants you to take over X number of cities... and the list goes on. These are the default quest lines.
    - [ ] Gods can also grant piety quests to gain their favor if not out of favor.
    - [ ] Gods may have relationships with the player, and if falling out of favor, there can be a penance quest.
    - [ ] Or instead of different shrines, maybe a shrine will be owned by a specific god and with newer rules will offer additional bonuses besides the one time brawn bonus.
- [ ] Army sort order: should be able to consider the terrain, empire, army-group, and any other modifiers to strength to achieve a correct sort for a particular battle.
- [ ] Army sort order: also should allow for army-group manual ordering. Once ordered, the group is not reordered before a battle, or at any other time.
- [ ] Meat Grinder: Record distance traveled before dying, keep record of max distance.
- [ ] Meat Grinder: Make the intermission a menu system allowing access to various things.
- [ ] bug: i18next parser isn't working, see: https://github.com/i18next/i18next-parser/issues/149
    - [ ] Better yet, come up with a way of managing the strings for now that works for our needs and drop the automatic parsing.
- [ ] Explicitly version the schemas used in the moddables.
- [ ] Keep accomplishment stats on objects like `army` and `army-group` and `player`.
- [ ] Positive and negative morale for winning / losing battles. Morale is contagious to nearby army groups.
- [ ] A battle loser can route before being totally destroyed.
- [ ] Prisoners.
- [ ] Boss battles.
- [ ] Armies: Medals for surviving a battle (Warlords 2 I believe allowed up to 4 per troop), with a random chance for earning a medal per battle. Each medal provides a brawn +1.
- [ ] Injuries for fighting in a battle. Winner may get to revive troops instead of losing everyone. (injuries === `constitution` effects).
- [ ] Terrain modifications beyond cities and towers, like traps, fires, fighting on different terrains (attacker in river, defender on shore; attacker on plains, defender on bridge).
- [ ] Experience for an army-group, as well as individual armies. Need a way to keep this from being gamed, like maybe when a group gets renowned it can't disband and keep a bonus, adding new armies dilutes the bonus, etc.
- [ ] In that very far future where there might be a modder, include how to import additional translations for modded data.
- [ ] Experiment with [blessed](https://github.com/chjj/blessed) for terminal GUIs.
- [ ] Flesh out extended deity interactions along with the greater effects of religion within an empire.
