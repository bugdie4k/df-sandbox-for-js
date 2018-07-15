const selectionSort = require('./selectionSort.js')
const getTestArrays = require('./getTestArrays.js')

describe('selection sort', () => {
  it('sorts correctly in place', () => {
    const { initial, sorted } = getTestArrays()
    const ret = selectionSort(initial)
    expect(ret).toBe(initial) // same object
    expect(ret).toEqual(sorted)
  })
})
