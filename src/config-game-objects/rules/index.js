import path from 'path'
import typeFactoryFactory from '../type-factory-factory'

const MODULE_DIR = path.resolve(__dirname)
const MODULE_NAME = path.basename(MODULE_DIR)
const DEFS_DIR = path.join(MODULE_DIR, 'defs')

export default typeFactoryFactory({
  DEFS_DIR,
  MODULE_NAME,
})
