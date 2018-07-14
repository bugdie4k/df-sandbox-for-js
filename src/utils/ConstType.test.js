const ConstType = require('./ConstType')

const E = new ConstType([ 'HEH', 'HAH' ])
console.log(E)
try {
  E.validate('huh')
} catch (err) {
  console.log(err)
}

const MY_CONST_TYPE = new ConstType([ 'OP', 'JOJ' ], { name: 'MY_CONST_TYPE' })
console.log(MY_CONST_TYPE)
try {
  MY_CONST_TYPE.validate('huh')
} catch (err) {
  console.log(err)
}

console.log(MY_CONST_TYPE.OP === MY_CONST_TYPE.OP)
console.log(MY_CONST_TYPE.OP === MY_CONST_TYPE.JOJ)
