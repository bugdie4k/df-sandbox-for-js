const { BinaryHeap } = require('./binary-heap.js');
const { inspect } = require('util');

const bh = new BinaryHeap();

console.log('INITIALIZE');
bh.add(2, 7, 17, 3, 25, 1, 19, 36, 100);
console.log(inspect(bh.treeArray));
console.log(bh.toPrettyStr());

console.log('TOOK:', bh.takeSome(3));
console.log(inspect(bh.treeArray));
console.log(bh.toPrettyStr());
