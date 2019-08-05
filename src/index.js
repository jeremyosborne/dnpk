const debug = require('debug')
const logger = debug('dnpk/battle-module-test')
const {ajv, schemaId} = require('schemas')

logger('Testing army schema defaults.')
const genericArmy = {}
logger('genericArmy = ', genericArmy)
ajv.getSchema(schemaId('army'))(genericArmy)
logger('genericArmy after running through AJV', genericArmy)
