import path from 'path'
import typeFactoryFactory from '../type-factory-factory'

export default typeFactoryFactory({
  // works as long as the folder names stay in sync.
  MODULE_NAME: path.basename(path.resolve(__dirname)),
})
