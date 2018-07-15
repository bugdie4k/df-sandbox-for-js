const { quickSortRecursive } = require('./quickSort.js')
const getTestArrays = require('./getTestArrays.js')

describe('quicksort recursive', () => {
  it('sorts correctly in place', () => {
    const { initial, sorted } = getTestArrays()
    const ret = quickSortRecursive(initial)
    expect(ret).toBe(initial) // same object
    expect(ret).toEqual(sorted)
  })
})
