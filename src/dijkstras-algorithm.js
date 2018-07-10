/**
 * graph priority-queue
 * 0     0
 * 0     1
 * 1     0
 * 1     1
 * class-oriented graph = 0
 * graphlib = 1
 * binary heap priority queue = 0
 * array priority queue = 1
 */

const { Graph, edgeTypes } = require('./data-structures/graphs/class-oriented-graph')
const PriorityQueue = require('./data-structures/priority-queue-with-binary-heap')
const { inspect } = require('util')
const fs = require('fs')

function createGraph () {
  const g = new Graph(edgeTypes.UNDIRECTED)
  // like in the gif https://en.wikipedia.org/wiki/Dijkstra's_algorithm
  g.addNode(1, { v: 'a' })
  g.addNode(2, { v: 'b' })
  g.addNode(3, { v: 'c' })
  g.addNode(4, { v: 'd' })
  g.addNode(5, { v: 'e' })
  g.addNode(6, { v: 'f' })
  g.addEdge(1, 2, { distance: 7 })
  g.addEdge(1, 3, { distance: 9 })
  g.addEdge(1, 6, { distance: 14 })
  g.addEdge(2, 3, { distance: 10 })
  g.addEdge(2, 4, { distance: 15 })
  g.addEdge(3, 6, { distance: 2 })
  g.addEdge(3, 4, { distance: 11 })
  g.addEdge(4, 5, { distance: 6 })
  g.addEdge(6, 5, { distance: 9 })
  return g
}

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
}

function dijkstra (g, srcId, dstId) {
  // min-priority queue
  const dist = {}
  const prev = {}
  const q = new PriorityQueue((p1, p2) => p1 < p2)
  Object.keys(g.nodes).forEach(nId => (dist[nId] = Infinity))
  dist[srcId] = 0
  q.add(dist[srcId], srcId)
  // TODO: continue
}

const g = createGraph()
dijkstra(g, 1, 5)
