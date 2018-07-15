function getTestArrays () {
  const initial = [ 3, 4, 5, 10, 2, 7, 6, 5, 4, 10, 20, 11, 15, 14, 13 ]
  const sorted = [ 2, 3, 4, 4, 5, 5, 6, 7, 10, 10, 11, 13, 14, 15, 20 ]
  const sortedBackwards = JSON.parse(JSON.stringify(sorted)).reverse()
  return { initial, sorted, sortedBackwards }
}

module.exports = getTestArrays
