const { insertionSort, COPY_TYPE } = require('./insertionSort.js')
const getTestArrays = require('./getTestArrays.js')
const assert = require('assert')

describe('insertion sort', () => {
  it('in place', () => {
    const { initial, sorted } = getTestArrays()
    const ret = insertionSort(initial)
    expect(ret).toBe(initial) // same object
    expect(ret).toEqual(sorted)
  })

  it('in place, parametrized by callback', () => {
    const { initial, sortedBackwards } = getTestArrays()
    const ret = insertionSort(initial, { cmp: (a, b) => a > b })
    expect(ret).toBe(initial) // same object
    expect(ret).toEqual(sortedBackwards)
  })

  it('with a JSON copy', () => {
    const { initial, sorted } = getTestArrays()
    const ret = insertionSort(initial, { copy: COPY_TYPE.JSON })
    assert(ret !== initial) // different objects
    expect(ret).toEqual(sorted)
    expect(initial).toEqual(getTestArrays().initial) // initial is unchanged
  })

  it('fails with bad COPY_TYPE', () => {
    expect.assertions(1)
    expect(() =>
      insertionSort([], { copy: 'BAD_COPY_TYPE' })
    ).toThrowErrorMatchingSnapshot()
  })
})
