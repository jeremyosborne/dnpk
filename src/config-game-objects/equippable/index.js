const path = require('path')
const typeFactoryFactory = require('../type-factory-factory')

const MODULE_DIR = path.resolve(__dirname)
const MODULE_NAME = path.basename(MODULE_DIR)
const DEFS_DIR = path.join(MODULE_DIR, 'defs')

module.exports = typeFactoryFactory({
  DEFS_DIR,
  MODULE_NAME,
})
