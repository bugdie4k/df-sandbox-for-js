const { quickSortRecursive, quickSortIterative } = require('./quickSort.js')
const getTestArrays = require('./getTestArrays.js')

describe('quicksort', () => {
  it('recursive: sorts correctly in place', () => {
    const { initial, sorted } = getTestArrays()
    const ret = quickSortRecursive(initial)
    expect(ret).toBe(initial) // same object
    expect(ret).toEqual(sorted)
  })

  it('iterative: sorts correctly in place', () => {
    const { initial, sorted } = getTestArrays()
    const ret = quickSortIterative(initial)
    expect(ret).toBe(initial) // same object
    expect(ret).toEqual(sorted)
  })
})
