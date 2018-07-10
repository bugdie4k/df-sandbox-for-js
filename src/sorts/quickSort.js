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

function quickSortAux (a, l, h) {
  if (l >= h) {
    return a
  }
  const pi = partition(a, l, h)
  quickSortAux(a, l, pi)
  quickSortAux(a, pi + 1, h)
  return a
}

const quickSort = a => quickSortAux(a, 0, a.length - 1)

module.exports = quickSort
