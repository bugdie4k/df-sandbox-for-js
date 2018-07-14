const IndexedBinaryHeap = require('./indexed-binary-heap')

const bh = new IndexedBinaryHeap()
bh.add(10, 20, 30, 25, 15, 8, 2, 9)
const { inspect } = require('util')
console.log(bh.treeArray)
console.log(bh.toPrettyStr())
console.log(inspect(bh.index))

console.log(bh.popFew(4))
console.log(bh.treeArray)
console.log(bh.toPrettyStr())
console.log(inspect(bh.index))
