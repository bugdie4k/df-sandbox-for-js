const dijkstra = require('./dijkstras-algorithm1.js')
const {
  Graph,
  EDGE_TYPE
} = require('./data-structures/graphs/class-oriented-graph')
const { inspect } = require('util')

/*
const fs = require('fs')
function dumpDotGv (g) {
  // console.log(inspect(g, { depth: 10 }));
  const gName = 'g1'
  const dotGvString = g.toDotGv({
    name: gName,
    vertexLabel: v => v.id.toString(),
    edgeLabel: e => e.data.distance.toString()
  })
  // console.log(dotGvString);
  fs.writeFileSync(`./${gName}.gv`, dotGvString)
} */

function createGraph () {
  const g = new Graph(EDGE_TYPE.UNDIRECTED)
  // like in the gif https://en.wikipedia.org/wiki/Dijkstra's_algorithm
  g.addNodes(
    [ 1, { v: 'a' }],
    [ 2, { v: 'b' }],
    [ 3, { v: 'c' }],
    [ 4, { v: 'd' }],
    [ 5, { v: 'e' }],
    [ 6, { v: 'f' }]
  )
  g.addEdges(
    [ 1, 2, { distance: 7 }],
    [ 1, 3, { distance: 9 }],
    [ 1, 6, { distance: 14 }],
    [ 2, 3, { distance: 10 }],
    [ 2, 4, { distance: 15 }],
    [ 3, 6, { distance: 2 }],
    [ 3, 4, { distance: 11 }],
    [ 4, 5, { distance: 6 }],
    [ 6, 5, { distance: 9 }]
  )
  return g
}

const g = createGraph()
const r = dijkstra(g, 1, 5)
console.log(inspect(r, { depth: 10 }))
