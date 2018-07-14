const { insertionSort, COPY_TYPE } = require('./insertionSort.js')
const assert = require('assert')

describe('insertion sort', () => {
  function get () {
    return {
      initial: [ 3, 4, 5, 10, 2, 7, 6, 5, 4, 10, 20, 11, 15, 14, 13 ],
      sorted: [ 2, 3, 4, 4, 5, 5, 6, 7, 10, 10, 11, 13, 14, 15, 20 ]
    }
  }

  it('sorts correctly in place', () => {
    const { initial, sorted } = get()
    const ret = insertionSort(initial)
    assert(ret === initial) // same object
    expect(ret).toEqual(sorted)
  })

  it('sorts correctly with a JSON copy', () => {
    const { initial, sorted } = get()
    const ret = insertionSort(initial, { copy: COPY_TYPE.JSON_COPY })
    assert(ret !== initial)
    expect(ret).toEqual(sorted)
  })

  it('fails with bad COPY_TYPE', () => {
    expect.assertions(1)
    expect(() =>
      insertionSort([], { copy: 'BAD_COPY_TYPE' })
    ).toThrowErrorMatchingSnapshot()
  })
})
