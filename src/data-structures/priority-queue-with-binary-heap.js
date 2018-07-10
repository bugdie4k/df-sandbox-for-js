const { BinaryHeap } = require('./trees/binary-heap')

class PriorityQueue {
  // default compare enables max-priority queue
  constructor (compare = (p1, p2) => p1 > p2) {
    // composition instead of inheritance
    this.binheap = new BinaryHeap((p, c) => compare(p.priority, c.priority))
  }

  /**
   * @param {any} priority
   * @param {any} data
   */
  add (priority, data) {
    this.binheap.addOne({ priority, data })
  }

  pop () {
    return this.binheap.pop()
  }

  peek () {
    return this.binheap.peek()
  }

  isEmpty () {
    return this.binheap.isEmpty()
  }

  find (predicate) {
    return this.binheap.find(predicate)
  }

  changePriority (predicate, newPriority) {
    this.binheap.modify(predicate, )
  }

  array () {
    return this.binheap.treeArray
  }
}

module.exports = PriorityQueue
