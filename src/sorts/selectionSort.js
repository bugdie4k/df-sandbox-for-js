function indexOfMin (a, start) {
  let minI = start
  let min = a[minI]
  for (let i = start; i < a.length; ++i) {
    if (a[i] < min) {
      min = a[i]
      minI = i
    }
  }
  return minI
}

function selectionSort (a) {
  for (let i = 0; i < a.length; ++i) {
    const minI = indexOfMin(a, i)
    const tmp = a[i]
    a[i] = a[minI]
    a[minI] = tmp
  }
  return a
}

module.exports = selectionSort
