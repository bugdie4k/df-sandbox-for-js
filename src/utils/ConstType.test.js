const ConstType = require('./ConstType')

describe('ConstType', () => {
  it('basic usage 1', () => {
    const E = new ConstType([ 'HEH', 'HAH' ])
    expect(E.HEH).toEqual('HEH:CONST_TYPE_CONSTANT')
    expect(E.HAH).toEqual('HAH:CONST_TYPE_CONSTANT')
  })

  it('basic usage 2', () => {
    const heh = '_H_E_H_'
    const hah = '_H_A_H_'
    const E = new ConstType({
      HEH: heh,
      HAH: hah
    })
    expect(E.HEH).toEqual(heh)
    expect(E.HAH).toEqual(hah)
  })

  it('cannot change the object', () => {
    const E = new ConstType([ 'HEH', 'HAH' ])
    E.opana = 123
    expect(E.opana).toBe(undefined)
  })

  it('adds UUID', () => {
    const E1 = new ConstType([ 'HEH', 'HAH' ], { addUUID: true })
    const E2 = new ConstType({ HEH: 'heh', HAH: 'hah' }, { addUUID: true })
    console.log(`${E1.HEH}\n${E1.HAH}\n------\n${E2.HEH}\n${E2.HAH}`)
  })
})
