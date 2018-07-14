const { BinaryHeap } = require('./binary-heap.js')
const { inspect } = require('util')

const bh = new BinaryHeap()

const iniArray = [ 2, 7, 17, 3, 25, 1, 19, 36, 100, 1, 0.5, 200, 0.2 ]
console.log('INITIALIZE WITH:', iniArray)
bh.add(...iniArray)
console.log(inspect(bh.treeArray))
console.log(bh.toPrettyStr())

console.log('TOOK:', bh.popFew(3))
console.log(inspect(bh.treeArray))
console.log(bh.toPrettyStr())

console.log('REMOVE 19: ', bh.removeOne(e => e === 19))
console.log(inspect(bh.treeArray))
console.log(bh.toPrettyStr())

console.log('TRY REMOVE 400: ', bh.removeOne(e => e === 400))
console.log(inspect(bh.treeArray))
console.log(bh.toPrettyStr())
