const selectionSort = require('./selectionSort.js');

const a1 = [3, 4, 5, 10, 2, 7, 6, 5, 4, 10, 20, 11, 15, 14, 13];

console.log('selection sort');
console.log('unsorted', a1);
console.log('sorted  ', selectionSort(a1));
