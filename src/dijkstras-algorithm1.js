/**
 * graph priority-queue
 * 0     0
 * 0     1
 * 0     2
 * 1     0
 * 1     1
 * 1     2
 * class-oriented graph = 0
 * graphlib = 1
 * binary heap priority queue = 0
 * indexed binary heap priority queue = 1
 * array priority queue = 2
 */

/**
 * This one is '0 0'. It doesn't decrease priority, just writes the same node with
 * higher priority (smaller distance) to the priority queue.
 */

const PriorityQueue = require('./data-structures/priority-queue-with-binary-heap')

function dijkstraRaw (g, srcId, dstId) {
  // min-priority queue
  const dist = {}
  const prev = {}
  const pq = new PriorityQueue((p1, p2) => p1 < p2)
  Object.keys(g.nodes).forEach(nId => (dist[nId] = Infinity))
  dist[srcId] = 0
  pq.add(dist[srcId], srcId)
  while (!pq.isEmpty()) {
    const { data: id } = pq.pop()
    if (id === dstId) {
      return { dist, prev }
    }
    const outIds = g.outNeighbors(id)
    for (const outId of outIds) {
      const newDist = dist[id] + g.getEdge(id, outId).data.distance
      if (newDist < dist[outId]) {
        dist[outId] = newDist
        prev[outId] = id
        pq.add(newDist, outId)
      }
    }
  }
  return { dist, prev }
}

function path (srcId, dstId, { dist, prev }) {
  const p = [ dstId ]
  let prevId
  do {
    prevId = prev[p[p.length - 1]]
    p.push(prevId)
  } while (prevId !== srcId)
  return { path: p.reverse(), distance: dist[dstId] }
}

function dijkstra (g, srcId, dstId) {
  return path(srcId, dstId, dijkstraRaw(g, srcId, dstId))
}

module.exports = dijkstra
