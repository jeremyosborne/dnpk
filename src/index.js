const {army} = require('data')
const _ = require('lodash')

console.log('Creating some armies.')
const armies = _.map([
  'heavy-infantry',
  'light-infantry',
  'wizard',
], (name) => army.create(name))

console.log('armies created:', JSON.stringify(armies, null, 4))

// TODO: work in localization of visual strings while doing the console reporting.

// Create 2 groups of armies.

// Engage the 2 groups in battle.

// Create the attacking group battle structure.

// Create the defending group battle structure.

// Run the battle between the groups.

// Return the battle group structure + statistics.
