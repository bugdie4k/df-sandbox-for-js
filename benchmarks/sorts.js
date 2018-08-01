const MBench = require('./MBench')
const fs = require('fs')
const assert = require('assert')
const { insertionSort } = require('../src/sorts/insertionSort')
const selectionSort = require('../src/sorts/selectionSort')
const {
  quickSortRecursive,
  quickSortIterative
} = require('../src/sorts/quickSort')

const readArray = JSONpath => JSON.parse(fs.readFileSync(JSONpath)).array

function bench (name, sortFn, arrayPath, sortedArrayPath) {
  const sortedArray = readArray(sortedArrayPath)
  const b = new MBench(name, {
    beforeEach: function () {
      this.array = readArray(arrayPath)
    },
    fn: function () {
      sortFn(this.array)
    },
    afterEach: function () {
      assert.deepStrictEqual(this.array, sortedArray)
      this.array = null
    }
  })
  b.run().report()
  console.log()
  return b
}

function bench1K (name, sortFn) {
  bench(name, sortFn, 'array1000.json', './sortedArray1000.json')
}
function bench10K (name, sortFn) {
  bench(name, sortFn, 'array10000.json', './sortedArray10000.json')
}
function bench100K (name, sortFn) {
  bench(name, sortFn, 'array100000.json', './sortedArray100000.json')
}

bench1K('insertionSort 1K', insertionSort)
bench1K('selectionSort 1K', selectionSort)
bench1K('quickSortRecursive 1K', quickSortRecursive)
bench1K('quickSortIterative 1K', quickSortIterative)

console.log('----\n')

bench10K('insertionSort 10K', insertionSort)
bench10K('selectionSort 10K', selectionSort)
bench10K('quickSortRecursive 10K', quickSortRecursive)
bench10K('quickSortIterative 10K', quickSortIterative)

console.log('----\n')

bench100K('insertionSort 100K', insertionSort)
bench100K('selectionSort 100K', selectionSort)
bench100K('quickSortRecursive 100K', quickSortRecursive)
bench100K('quickSortIterative 100K', quickSortIterative)

/* const b = new MBench('', {
  beforeEach: function () {
    this.array = readArray('./array1000.json')
    this.sortedArray = readArray('./sortedArray1000.json')
  },
  fn: function () {
    insertionSort(this.array)
  },
  afterEach: function () {
    assert.deepStrictEqual(this.array, this.sortedArray)
    this.array = null
  }
})
b.run().report()
 */
