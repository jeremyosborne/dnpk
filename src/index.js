const {army} = require('data')
const _ = require('lodash')

console.log('Creating some armies.')
const armies = _.map([
  'heavy-infantry',
  'light-infantry',
], (name) => army.create(name))

console.log('armies created:', armies)
