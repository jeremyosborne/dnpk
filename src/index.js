const fs = require('fs')
const Ajv = require('ajv')

const ajv = new Ajv({
  useDefaults: true
})
const schema = JSON.parse(fs.readFileSync('./schemas/effect.schema.json'))
const armySchema = ajv.compile(schema)

const army = {}

console.log('armySchema(army):', armySchema(army))
console.log('army after side effects:', army)
