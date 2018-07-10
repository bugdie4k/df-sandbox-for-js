function insertionSort (a) {
  for (let i = 1; i < a.length; ++i) {
    let j = i - 1
    const x = a[i]
    while (j >= 0 && a[j] > x) {
      a[j + 1] = a[j]
      --j
    }
    a[j + 1] = x
  }
  return a
}

module.exports = insertionSort
