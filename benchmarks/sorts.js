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

const results = {}

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
    },
    afterAll: function () {
      // console.log(this.this.stats.mean)
      results[name] = MBench.toMsNs(this.this.stats.mean)
    }
  })
  b.run().report()
  return b
}

function benchSize (name, sortFn, size) {
  const dir = `arrays/size${size}`
  return bench(name, sortFn, `${dir}/random.json`, `${dir}/sorted.json`)
}

for (let size = 100; size < 1000; size += 100) {
  const benchCur = (name, sortFn) => benchSize(name, sortFn, size)
  benchCur(`quickSortRecursive-${size}`, quickSortRecursive)
  benchCur(`quickSortIterative-${size}`, quickSortIterative)
  benchCur(`insertionSort-${size}`, insertionSort)
  benchCur(`selectionSort-${size}`, selectionSort)
  console.log()
}

for (let size = 1000; size < 5000; size += 1000) {
  const benchCur = (name, sortFn) => benchSize(name, sortFn, size)
  benchCur(`quickSortRecursive-${size}`, quickSortRecursive)
  benchCur(`quickSortIterative-${size}`, quickSortIterative)
  benchCur(`insertionSort-${size}`, insertionSort)
  benchCur(`selectionSort-${size}`, selectionSort)
  console.log()
}

for (let size = 5000; size <= 10000; size += 5000) {
  const benchCur = (name, sortFn) => benchSize(name, sortFn, size)
  benchCur(`quickSortRecursive-${size}`, quickSortRecursive)
  benchCur(`quickSortIterative-${size}`, quickSortIterative)
  benchCur(`insertionSort-${size}`, insertionSort)
  benchCur(`selectionSort-${size}`, selectionSort)
  console.log()
}

fs.writeFileSync(
  `results-${(new Date()).toString().replace(/ /g, '-')}`,
  JSON.stringify(results, null, 2)
)

// function bench5K (name, sortFn) {
//   benchSize(name, sortFn, 5000)
// }

// function bench10K (name, sortFn) {
//   benchSize(name, sortFn, 10000)
// }

// bench10K('insertionSort 10K', insertionSort)
// bench10K('selectionSort 10K', selectionSort)
// bench10K('quickSortRecursive 10K', quickSortRecursive)
// bench10K('quickSortIterative 10K', quickSortIterative)

// console.log('----\n')

// bench100K('insertionSort 100K', insertionSort)
// bench100K('selectionSort 100K', selectionSort)
// bench100K('quickSortRecursive 100K', quickSortRecursive)
// bench100K('quickSortIterative 100K', quickSortIterative)

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
