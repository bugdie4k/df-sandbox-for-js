const { BinaryHeap } = require('./binary-heap')

class IndexedBinaryHeap extends BinaryHeap {
  constructor (compare = (p, c) => p > c) {
    super(compare)
    this.element2Index = new Map()
  }

  _updateIndex (i) {
    this.element2Index.set(this.treeArray[i], i)
  }

  _swap (i, j) {
    super._swap(i, j)
    this._updateIndex(i)
    this._updateIndex(j)
  }

  heapifyDown (curI) {
    this._updateIndex(curI)
    super.heapifyDown()
  }

  heapifyUp (curI) {
    this._updateIndex(curI)
    super.heapifyUp()
  }

  _popInnerArray () {
    const lastEl = super._popInnerArray()
    this.element2Index.delete(lastEl)
    return lastEl
  }

  //

  replaceOneEl (el, newEl) {
    const i = this.element2Index.get(el)
    return this._replaceAtIndex(i)
  }

  removeOneEl (el) {
    const i = this.element2Index.get(el)
    return this._replaceAtIndex(i)
  }
}

module.exports = IndexedBinaryHeap
