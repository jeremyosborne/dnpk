# Dark nights of the plague king

A wargame inspired by the original [Warlords game by SSG](https://en.wikipedia.org/wiki/Warlords_(1990_video_game)) and what I always wanted to see as available in a modern version of that game.

## Runtime configuration options

Modules that make use of runtime configuration settings should list those within their module docs under the `## Runtime configuration options` heading.

### Global configuration settings and options

* `DEBUG=dnpk/*`: optionally set to show all logging messages specific to this application.
* `NODE_PATH=src/core`: MUST be applied to the environment of all executables (app, tests, etc.) using this application or modules within this application to allow a "local module" style of importing vs. the horrendously brittle `../../../` relative path reference to other modules.
    * `NODE_PATH=src/core:src/testing-grounds`: MUST be supplied when running the developer focused `testing-grounds` test app.

## TODO

- [ ] Make the basic scenes of the meat grinder idle adventure.
    - [X] regular unit recruitment
    - [X] elite unit recruitment
    - [X] aerial unit recruitment
    - [X] treasure items
    - [X] vault / equipping heroes
    - [X] fight: large number of weak enemies
    - [X] fight: tough hero + entourage
    - [ ] fight: city siege (huge number of random enemies with city bonus)
        - [X] structures as a basic type (fortification, buildings... other words that work...)
        - [X] change "command" effect to "brawn-aura"
        - [X] structures effects affect strength calculations
        - [ ] structures passable to battle, and then affect strength calculations

## Future TODO and ideas

- [ ] Meat Grinder: Record distance traveled before dying.
- [ ] Meat Grinder: Make the intermission a menu system allowing access to various things.
- [ ] bug: i18next parser isn't working, see: https://github.com/i18next/i18next-parser/issues/149
    - [ ] Better yet, come up with a way of managing the strings for now that works for our needs and drop the automatic parsing.
- [ ] Explicitly version the schemas used in the moddables.
- [ ] Add production base costs + upkeep (1/2 cost per turn) for armies.
- [ ] Add cosmetics to armies and items: elven light infantry, human light infantry; human archers and elvish archers (instead of the `elven archer` as a type).
- [ ] Keep accomplishment stats on objects like `army` and `army-group` and `player`.
- [ ] Positive and negative morale for winning / losing battles. Morale is contagious to nearby army groups.
- [ ] A battle loser can route before being totally destroyed.
- [ ] Prisoners.
- [ ] Boss battles.
- [ ] Injuries for fighting in a battle. Winner may get to revive troops instead of losing everyone.
- [ ] Terrain modifications beyond cities and towers, like traps and fires.
- [ ] Experience for an army-group, as well as individual armies. Need a way to keep this from being gamed, like maybe when a group gets renowned it can't disband and keep a bonus, adding new armies dilutes the bonus, etc.
- [ ] In that very far future where there might be a modder, include how to import additional translations for modded data.
- [ ] Experiment with [blessed](https://github.com/chjj/blessed) for terminal GUIs.
- [ ] Flesh out extended deity interactions along with the greater effects of religion within an empire.
