const ConstType = require('../utils/ConstType')

const COPY_TYPE = new ConstType([ 'NONE', 'IN_PLACE', 'JSON_COPY' ])

function insertionSortInPlace (a) {
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

function insertionSort (a, options = {}) {
  const { IN_PLACE, NONE, JSON_COPY } = COPY_TYPE
  let { copy } = options
  if (copy === undefined) copy = IN_PLACE
  switch (copy) {
    case NONE:
    case IN_PLACE:
      return insertionSortInPlace(a)
    case JSON_COPY:
      const copyOfA = JSON.parse(JSON.stringify(a))
      return insertionSortInPlace(copyOfA)
    default:
      COPY_TYPE.validate(copy)
  }
}

module.exports = {
  insertionSortInPlace,
  insertionSort,
  COPY_TYPE
}
