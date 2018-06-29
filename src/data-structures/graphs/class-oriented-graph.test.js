const { Graph } = require('./class-oriented-graph.js');
const { inspect } = require('util');

const g = new Graph();

g.addNode(1, { v: 1 });
g.addNode(2, { v: 2 });
g.addNode(3, { v: 3 });
g.addEdges(1, 2, 3);

console.log(inspect(g));
