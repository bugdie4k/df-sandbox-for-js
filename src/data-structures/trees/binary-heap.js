const formatree = require('formatree')

/**
 * @const {object}
 * @prop {string} OBJECT - The style produces object like
 * `{ data: root , children: [ { data: v1, children: [ ... ]}, ... ] }`
 * @prop {string} FIELD - The style produces object like `{ root: { v1: {} } }`.
 * With VERTEX_AS_FIELD vertex contents are written into object field after `.toString()`.
 */
const VERTEX_STYLE = Object.freeze({
  OBJECT: 'OBJECT_VERTEX_STYLE_CONSTANT',
  FIELD: 'FIELD_VERTEX_STYLE_CONSTANT'
})

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

function child1Index (i) {
  return 2 * i + 1
}

function child2Index (i) {
  return 2 * i + 2
}

function childrenIndexes (i) {
  return [child1Index[i], child2Index[i]]
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

  heapifyUp (curI) {
    const { a, cmp } = this._aliases()
    while (true) {
      if (curI === 0) break
      const parentI = parentIndex(curI)
      if (cmp(a[parentI], a[curI])) break
      const tmp = a[parentI]
      a[parentI] = a[curI]
      a[curI] = tmp
      curI = parentI
    }
  }

  addOne (el) {
    this.treeArray.push(el)
    const elI = this.treeArray.length - 1
    if (elI !== 0) {
      this.heapifyUp(elI)
    }
  }

  add (...elements) {
    for (const el of elements) this.addOne(el)
  }

  peek () {
    return this.treeArray[0]
  }

  heapifyDown (curI) {
    const { a, cmp } = this._aliases()
    while (true) {
      const [child1I, child2I] = childrenIndexes(curI)
      // if the child index is >= to length then then there is no child and cmp must succeed.
      // if curI has no children it is on the bootom and the algoritm must quit.
      const cmpWithChild1 = cmp(a[curI], a[child1I]) || child1I >= a.length
      const cmpWithChild2 = cmp(a[curI], a[child2I]) || child2I >= a.length
      if (cmpWithChild1 && cmpWithChild2) break
      let swapWithI = child1I
      // if there is no child1I, then swap must occur with child2I.
      // if there is no child1I and also no child2I on this iteration
      // the algorith would quit due to (cmpWithChild1 && cmpWithChild2).
      if (child1I >= a.length || cmp(a[child2I], a[child1I])) swapWithI = child2I
      const tmp = a[curI]
      a[curI] = a[swapWithI]
      a[swapWithI] = tmp
      curI = swapWithI
    }
  }

  _removeAtIndex (i) {
    const { a } = this._aliases()
    const result = a[i]
    a[i] = a[a.length - 1]
    a.pop()
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
   * @param {any} el1 - Element of the heap
   * @param {any} el2 - Also element of the heap
   * @returns {boolean} - `true` if el1 equals el2 and `false` otherwise
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

  removeOne (predicate) {
    const i = this._findIndex(predicate)
    if (i === -1) {
      return { element: undefined, found: false }
    }
    return { element: this._removeAtIndex(i), found: true }
  }

  modify (predicate, newEl) {
    const i = this._findIndex(predicate)
    if (i === -1) return
    this.treeArray[i] = newEl
    this.heapifyUp(i)
    this.heapifyDown(i)
    return newEl
  }
}

module.exports = {
  BinaryHeap,
  VERTEX_STYLE
}
