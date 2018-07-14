const formatree = require('formatree')
const ConstType = require('../../utils/ConstType')

/**
 * @name VERTEX_STYLE
 * @const {object}
 * @prop {string} OBJECT - The style produces object like
 * `{ data: root , children: [ { data: v1, children: [ ... ]}, ... ] }`
 * @prop {string} FIELD - The style produces object like `{ root: { v1: {} } }`.
 * With VERTEX_AS_FIELD vertex contents are written into object field after `.toString()`.
 * @prop {function} validate
 */
const VERTEX_STYLE = new ConstType([ 'OBJECT', 'FIELD' ])

/** @private */
function toJsVertexAsObject (binaryTreeArray, curI) {
  if (curI < binaryTreeArray.length) {
    const child1 = toJsVertexAsObject(binaryTreeArray, 2 * curI + 1)
    const child2 = toJsVertexAsObject(binaryTreeArray, 2 * curI + 2)
    const children = []
    if (child1 !== undefined) children.push(child1)
    if (child2 !== undefined) children.push(child2)
    if (children.length === 0) {
      return { data: binaryTreeArray[curI] }
    }
    return {
      data: binaryTreeArray[curI],
      children
    }
  }
}

/** @private */
function toJsVertexAsField (binaryTreeArray, curI) {
  if (curI < binaryTreeArray.length) {
    const child1 = toJsVertexAsField(binaryTreeArray, 2 * curI + 1)
    const child2 = toJsVertexAsField(binaryTreeArray, 2 * curI + 2)
    const children = {}
    if (child1 !== undefined) Object.assign(children, child1)
    if (child2 !== undefined) Object.assign(children, child2)
    return {
      [binaryTreeArray[curI].toString()]: children
    }
  }
}

function childrenIndexes (i) {
  const base = 2 * i
  return [ base + 1, base + 2 ]
}

function parentIndex (i) {
  return Math.floor(i / 2)
}

class BinaryHeap {
  /**
   * @typedef {function} BinaryHeap~compare
   * @callback
   * @param {any} p - Parent
   * @param {any} c - Children
   * @returns {boolean}
   */
  /**
   * @param {BinaryHeap~compare} compare - Parent to children comparison.
   * If returns true then the order is correct.
   * Default enables the max-heap for numbers and strings.
   */
  constructor (compare = (p, c) => p > c) {
    this.treeArray = []
    this.compare = compare
  }

  _aliases () {
    return {
      a: this.treeArray,
      cmp: this.compare
    }
  }

  toJS (style = VERTEX_STYLE.OBJECT) {
    if (style === VERTEX_STYLE.OBJECT) {
      return toJsVertexAsObject(this.treeArray, 0)
    } else if (style === VERTEX_STYLE.FIELD) {
      return toJsVertexAsField(this.treeArray, 0)
    }
    throw new Error(`Unknown style ${style}`)
  }

  toPrettyStr () {
    return formatree(this.toJS(VERTEX_STYLE.FIELD), {
      sibling: '|-- ',
      lastSibling: '`-- ',
      indent: '|   '
    })
  }

  get size () {
    return this.treeArray.length
  }

  isEmpty () {
    return this.size === 0
  }

  _swap (i, j) {
    const tmp = this.treeArray[i]
    this.treeArray[i] = this.treeArray[j]
    this.treeArray[j] = tmp
  }

  heapifyUp (curI) {
    const { a, cmp } = this._aliases()
    while (true) {
      if (curI === 0) break
      const parentI = parentIndex(curI)
      if (cmp(a[parentI], a[curI])) break
      this._swap(curI, parentI)
      curI = parentI
    }
  }

  addOne (el) {
    this.treeArray.push(el)
    const elI = this.treeArray.length - 1
    this.heapifyUp(elI)
  }

  add (...elements) {
    for (const el of elements) this.addOne(el)
  }

  peek () {
    return this.treeArray[0]
  }

  heapifyDown (curI) {
    const { a, cmp } = this._aliases()
    if (a.length <= 1) return
    while (true) {
      const [ child1I, child2I ] = childrenIndexes(curI)
      // if the child index is >= to length then then there is no child and cmp must succeed.
      // if curI has no children it is on the bootom and the algoritm must quit.
      const child1InBounds = child1I < a.length
      const child2InBounds = child2I < a.length
      const cmpWithChild1 = !child1InBounds || cmp(a[curI], a[child1I])
      const cmpWithChild2 = !child2InBounds || cmp(a[curI], a[child2I])
      if (cmpWithChild1 && cmpWithChild2) break
      let swapWithI = child1I
      // if there is no child1I, then swap must occur with child2I.
      // if there is no child1I and also no child2I on this iteration
      // the algorith would quit due to (cmpWithChild1 && cmpWithChild2).
      if (!child1InBounds || (child2InBounds && cmp(a[child2I], a[child1I]))) { swapWithI = child2I }
      this._swap(curI, swapWithI)
      curI = swapWithI
    }
  }

  /**
   * The sole purpose is to be overrided in IndexedBinaryHeap,
   * to update the index.
   */
  _popInnerArray () {
    return this.treeArray.pop()
  }

  _removeAtIndex (i) {
    const { a } = this._aliases()
    const result = a[i]
    a[i] = a[a.length - 1]
    this._popInnerArray()
    this.heapifyDown(i)
    return result
  }

  pop () {
    return this._removeAtIndex(0)
  }

  popFew (amount) {
    const result = []
    for (let i = 0; i < amount; ++i) result.push(this.pop())
    return result
  }

  /**
   * @typedef {function} find~predicate
   * @callback
   * @param {any} el - Element of the heap
   * @returns {boolean} - `true` if el is the one searched for
   */
  /**
   * @param {find~predicate} predicate
   * @returns {any} - Found element from the heap or undefined
   */
  find (predicate) {
    return this.treeArray.find(predicate)
  }

  /**
   * @param {find~predicate} predicate
   * @returns {number} - Index
   */
  _findIndex (predicate) {
    return this.treeArray.findIndex(predicate)
  }

  /**
   * @param {find~predicate} predicate
   */
  removeOne (predicate) {
    const i = this._findIndex(predicate)
    if (i === -1) {
      return { el: undefined, found: false }
    }
    return { el: this._removeAtIndex(i), found: true }
  }

  _replaceAtIndex (i, newEl) {
    this.treeArray[i] = newEl
    this.heapifyUp(i)
    this.heapifyDown(i)
    return newEl
  }

  /**
   * @param {find~predicate} predicate
   * @param {any} newEl
   */
  replaceOne (predicate, newEl) {
    const i = this._findIndex(predicate)
    if (i === -1) return
    return this._removeAtIndex(i)
  }
}

module.exports = {
  BinaryHeap,
  VERTEX_STYLE
}
