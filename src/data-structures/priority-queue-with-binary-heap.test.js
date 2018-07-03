const PriorityQueue = require('./priority-queue-with-binary-heap');
const { inspect } = require('util');

// min-priority queue
const q = new PriorityQueue((p1, p2) => p1 < p2);
q.add(5);
q.add(1);
q.add(6);
q.add(2);
console.log(inspect(q, { depth: 10 }));
