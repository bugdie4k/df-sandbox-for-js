const fs = require('fs')
const { quickSortRecursive } = require('../src/sorts/quickSort')
const cp = require('child_process')

function randint (max) {
  return Math.floor(Math.random() * max)
}

function JSONclone (x) {
  return JSON.parse(JSON.stringify(x))
}

function genArray (size, max) {
  const array = []
  for (let i = 0; i < size; ++i) {
    array.push(randint(max))
  }
  const sortedArray = quickSortRecursive(JSONclone(array))
  const dir = `arrays/size${size}`
  cp.spawnSync('mkdir', [ '-p', dir ])
  fs.writeFileSync(`${dir}/random.json`, JSON.stringify({ array }))
  fs.writeFileSync(`${dir}/sorted.json`, JSON.stringify({ array: sortedArray }))
}

for (let size = 100; size < 1000; size += 100) {
  genArray(size, 1000000)
  console.log(`${size} DONE`)
}

for (let size = 1000; size < 5000; size += 1000) {
  genArray(size, 1000000)
  console.log(`${size} DONE`)
}

for (let size = 5000; size <= 250000; size += 5000) {
  genArray(size, 1000000)
  console.log(`${size} DONE`)
}
