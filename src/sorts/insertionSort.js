const ConstType = require('../utils/ConstType')

const COPY_TYPE = new ConstType([ 'NONE', 'IN_PLACE', 'JSON' ])

/* function insertionSortNumericInPlace (a) {
  for (let i = 1; i < a.length; ++i) {
    let j = i - 1
    const x = a[i]
    while (j >= 0 && a[j] > x)) {
      a[j + 1] = a[j]
      --j
    }
    a[j + 1] = x
  }
  return a
} */

function insertionSortInPlace (a, cmp) {
  for (let i = 1; i < a.length; ++i) {
    let j = i - 1
    const x = a[i]
    while (j >= 0 && !cmp(a[j], x)) {
      a[j + 1] = a[j]
      --j
    }
    a[j + 1] = x
  }
  return a
}

function insertionSort (a, options = {}) {
  let { copy, cmp } = options
  if (copy === undefined) copy = COPY_TYPE.IN_PLACE
  if (cmp === undefined) cmp = (a, b) => a < b
  switch (copy) {
    case COPY_TYPE.NONE:
    case COPY_TYPE.IN_PLACE:
      return insertionSortInPlace(a, cmp)
    case COPY_TYPE.JSON:
      const copyOfA = JSON.parse(JSON.stringify(a))
      return insertionSortInPlace(copyOfA, cmp)
    default:
      COPY_TYPE.validate(copy)
  }
}

module.exports = {
  insertionSort,
  COPY_TYPE
}
