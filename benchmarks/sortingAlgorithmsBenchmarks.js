const MBench = require('./MBench')
const fs = require('fs')
const assert = require('assert')
const { insertionSort } = require('../src/sorts/insertionSort')
const selectionSort = require('../src/sorts/selectionSort')
const {
  quickSortRecursive,
  quickSortIterative
} = require('../src/sorts/quickSort')
const path = require('path')

const readArray = (JSONpath) => JSON.parse(fs.readFileSync(JSONpath)).array

const results = []

function sortBench (name, sortFn, arrayPath, sortedArrayPath) {
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
      const [ ms, ns ] = MBench.toMsNs(this.this.stats.mean)
      results.push({
        name,
        info: {
          sortFnName: sortFn.name,
          arraySize: sortedArray.length,
          arrayPath
        },
        time: { ms, ns }
      })
    }
  })
  b.run().report()
  return b
}

function sortBenchSize (name, sortFn, size) {
  const dir = `arrays/size${size}`
  return sortBench(name, sortFn, `${dir}/random.json`, `${dir}/sorted.json`)
}

for (let size = 100; size < 1000; size += 100) {
  const plusSize = (s) => `${s}-${size}`
  const sortBenchCur = (name, sortFn) =>
    sortBenchSize(plusSize(name), sortFn, size)
  sortBenchCur('quickSortRecursive', quickSortRecursive)
  sortBenchCur('quickSortIterative', quickSortIterative)
  sortBenchCur('insertionSort', insertionSort)
  sortBenchCur('selectionSort', selectionSort)
  console.log()
}

for (let size = 1000; size < 5000; size += 1000) {
  const plusSize = (s) => `${s}-${size}`
  const sortBenchCur = (name, sortFn) =>
    sortBenchSize(plusSize(name), sortFn, size)
  sortBenchCur('quickSortRecursive', quickSortRecursive)
  sortBenchCur('quickSortIterative', quickSortIterative)
  sortBenchCur('insertionSort', insertionSort)
  sortBenchCur('selectionSort', selectionSort)
  console.log()
}

for (let size = 5000; size <= 20000; size += 5000) {
  const plusSize = (s) => `${s}-${size}`
  const sortBenchCur = (name, sortFn) =>
    sortBenchSize(plusSize(name), sortFn, size)
  sortBenchCur('quickSortRecursive', quickSortRecursive)
  sortBenchCur('quickSortIterative', quickSortIterative)
  sortBenchCur('insertionSort', insertionSort)
  sortBenchCur('selectionSort', selectionSort)
  console.log()
}

const thisBenchName = path.basename(__filename).replace(/\.js$/g, '')
const thisBenchDirName = path.join(__dirname, 'results', thisBenchName)
if (!fs.existsSync(thisBenchDirName)) {
  fs.mkdirSync(thisBenchDirName)
}

const date = new Date(Date.now()).toLocaleString('hi').replace(/[\s,/:]/g, '-')
fs.writeFileSync(
  path.join(thisBenchDirName, `results-on-${date}.json`),
  JSON.stringify({ results }, null, 2)
)
