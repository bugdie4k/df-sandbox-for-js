const { insertionSort } = require('../src/sorts/insertionSort')
const selectionSort = require('../src/sorts/selectionSort')
const { quickSortRecursive } = require('../src/sorts/quickSort')
const Benchmark = require('benchmark')
// const { inspect } = require('util')

const prn = s => process.stdout.write(s)
const prnln = s => prn(`${s}\n`)

function bench (name, fn) {
  const b = new Benchmark(name, fn)
  b.on('start', () => prnln(`>> START: ${name}`))
    .on('cycle', () => prn('.'))
    .on('complete', () => {
      const mean = b.stats.mean
      prnln(`\nMEAN: ${mean}s = ${mean * 1000}ms`)
      prnln(`<< END: ${name}`)
    })
    .run()
}

function benchSort (name, sortFn, arrayJSON) {
  bench(name, () => {
    const { array } = require(arrayJSON)
    sortFn(array)
  })
}

/* const benchSortOn1000 = (name, sortFn) =>
  benchSort(name + ' on 1000', sortFn, './array1000.json')
benchSortOn1000('insertion', insertionSort)
benchSortOn1000('selection', selectionSort)
benchSortOn1000('quicksort recursive', quickSortRecursive) */

const benchSortOn10000 = (name, sortFn) =>
  benchSort(name + ' on 10000', sortFn, './array10000.json')
// benchSortOn10000('insertion', insertionSort)
// benchSortOn10000('selection', selectionSort)
// benchSortOn10000('quicksort recursive', quickSortRecursive) // overflow

const benchSortOn100000 = (name, sortFn) =>
  benchSort(name + ' on 100000', sortFn, './array100000.json')
// benchSortOn100000('insertion', insertionSort) // to slow
// benchSortOn100000('selection', selectionSort) // to slow
// benchSortOn100000('quicksort recursive', quickSortRecursive) // overflow
