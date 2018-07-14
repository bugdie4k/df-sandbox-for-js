const quickSort = require('./quickSort.js')

const a1 = [ 3, 4, 5, 10, 2, 7, 6, 5, 4, 10, 20, 11, 15, 14, 13 ]

console.log('quick sort (Hoare partition scheme)')
console.log('unsorted', a1)
console.log('sorted  ', quickSort(a1))
