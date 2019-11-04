# Dark nights of the plague king

A wargame inspired by the original [Warlords game by SSG](https://en.wikipedia.org/wiki/Warlords_(1990_video_game)) and what I always wanted to see as available in a modern version of that game.

## Runtime configuration options

Modules that make use of runtime configuration settings should list those within their module docs under the `## Runtime configuration options` heading.

### Global configuration settings and options

* `DEBUG=dnpk/*`: optionally set to show all logging messages specific to this application.
* `NODE_PATH=src`: MUST be applied to the environment of all executables (app, tests, etc.) using this application or modules within this application to allow a "local module" style of importing vs. the horrendously brittle `../../../` relative path reference to other modules.
    * `NODE_PATH=src:src/testing-grounds`: MUST be supplied when running the developer focused `testing-grounds` test app.

## TODO

- [ ] Make the basic scenes of the meat grinder idle adventure.
    - [ ] regular unit recruitment
    - [ ] special unit recruitment
    - [ ] vault / equipping heroes
    - [ ] treasure items
    - [ ] city siege
    - [ ] fight modification: the winner can limp along with some wounded units.
    - [ ] encounter function: provide a sampling of only good things (rare)
- [ ] Add base costs + upkeep (1/2 cost per turn) for armies.
- [ ] Keep stats on objects like `army` and `army-group` and `player`.
- [ ] Find a JavaScript lib like numpy/scipy.
- [ ] Explicitly version the schemas used in the moddables.
- [ ] Try turning flow back on now that esdoc is "fixed".
- [ ] bug: i18next parser isn't working, see: https://github.com/i18next/i18next-parser/issues/149

## Ideas

- [ ] Positive and negative morale for winning / losing battles. Morale is contagious to nearby army groups.
- [ ] A battle loser can route before being totally destroyed.
- [ ] Prisoners.
- [ ] Injuries for fighting in a battle.
- [ ] Terrain modifications beyond cities and towers, like traps and fires.
- [ ] Experience for an army-group, as well as individual armies. Need a way to keep this from being gamed, like maybe when a group gets renowned it can't disband and keep a bonus, adding new armies dilutes the bonus, etc.
- [ ] In that very far future where there might be a modder, include how to import additional translations for modded data.
- [ ] Experiment with [blessed](https://github.com/chjj/blessed) for terminal GUIs.
- [ ] Flesh out extended deity interactions along with the greater effects of religion within an empire.
