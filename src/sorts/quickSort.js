// Recursive

/** Hoare partition scheme */
function partition (a, l, h) {
  const pivot = a[l]
  let i = l - 1
  let j = h + 1
  while (true) {
    do {
      ++i
    } while (a[i] < pivot)
    do {
      --j
    } while (a[j] > pivot)
    if (i >= j) {
      return j
    }
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
}

function quickSortRecursiveAux (a, l, h) {
  if (l >= h) {
    return a
  }
  const pi = partition(a, l, h)
  quickSortRecursiveAux(a, l, pi)
  quickSortRecursiveAux(a, pi + 1, h)
  return a
}

const quickSortRecursive = a => quickSortRecursiveAux(a, 0, a.length - 1)

// Iterative

function quickSortIterativeAux (a, l, h) {
  const rangeStack = [[ l, h ]]
  while (rangeStack.length !== 0) {
    const [ l, h ] = rangeStack.pop()
    if (l >= h) {
      continue
    }
    const pi = partition(a, l, h)
    rangeStack.push([ l, pi ], [ pi + 1, h ])
  }
  return a
}

const quickSortIterative = a => quickSortIterativeAux(a, 0, a.length - 1)

module.exports = { quickSortRecursive, quickSortIterative }
